import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { APP_CONFIG, isGeminiApiKeyConfigured } from "./server/config.ts";
import {
  GeminiServiceError,
  humanizeTextWithGemini,
} from "./server/geminiService.ts";
import {
  resolveClientIdentifier,
  usageStore,
} from "./server/rateLimiter.ts";
import {
  countCharacters,
  countWords,
  validateHumanizeRequest,
} from "./server/validation.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Trust proxy headers for accurate IP rate limiting in cloud environments
  app.set("trust proxy", 1);

  // Security & CORS middleware (allow embedding in AI Studio preview iframe and deployed domains)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, X-Client-Session"
      );
    }

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

  // Enforce strict JSON payload size limit to prevent abuse
  app.use(express.json({ limit: "64kb" }));

  // Handle malformed JSON payloads or oversized payloads cleanly with valid JSON
  app.use(
    (
      err: Error & { type?: string; status?: number },
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if (err.type === "entity.too.large") {
        res.status(413).json({
          success: false,
          error: "Your text is too long (HTTP 413). Please shorten it and try again.",
        });
        return;
      }
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({
          success: false,
          error: "Invalid JSON request payload (HTTP 400). Please try again.",
        });
        return;
      }
      next(err);
    }
  );

  /**
   * GET /api/health
   * Simple health check endpoint for Cloud Run / deployment probes.
   */
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      success: true,
      status: "ok",
      apiConfigured: isGeminiApiKeyConfigured(),
    });
  });

  /**
   * GET /api/config
   * Returns public application configuration and limits.
   */
  app.get("/api/config", (_req: Request, res: Response) => {
    res.json({
      success: true,
      limits: {
        maxWords: APP_CONFIG.MAX_INPUT_WORDS,
        maxCharacters: APP_CONFIG.MAX_INPUT_CHARACTERS,
        dailyRequests: APP_CONFIG.DAILY_REQUEST_LIMIT,
      },
      styles: APP_CONFIG.ALLOWED_STYLES,
      intensities: APP_CONFIG.ALLOWED_INTENSITIES,
      languages: APP_CONFIG.ALLOWED_LANGUAGES,
      apiConfigured: isGeminiApiKeyConfigured(),
    });
  });

  /**
   * GET /api/usage
   * Returns current rate-limit usage and application limits for the user's session.
   */
  app.get("/api/usage", async (req: Request, res: Response) => {
    try {
      const clientId = resolveClientIdentifier(req);
      const rateLimit = await usageStore.getStatus(clientId);

      res.json({
        success: true,
        rateLimit: {
          limit: rateLimit.limit,
          used: rateLimit.used,
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        limits: {
          maxWords: APP_CONFIG.MAX_INPUT_WORDS,
          maxCharacters: APP_CONFIG.MAX_INPUT_CHARACTERS,
          dailyRequests: APP_CONFIG.DAILY_REQUEST_LIMIT,
        },
        apiConfigured: isGeminiApiKeyConfigured(),
      });
    } catch (error: unknown) {
      console.error("[API /api/usage] Failed to fetch usage status:", error);
      res.status(500).json({
        success: false,
        error: "Unable to fetch usage status right now (HTTP 500).",
      });
    }
  });

  /**
   * POST /api/usage/reset
   * Resets the current client's daily usage counter.
   */
  app.post("/api/usage/reset", async (req: Request, res: Response) => {
    try {
      const clientId = resolveClientIdentifier(req);
      const rateLimit = await usageStore.reset(clientId);
      res.json({
        success: true,
        rateLimit,
      });
    } catch (error: unknown) {
      console.error("[API /api/usage/reset] Failed to reset usage:", error);
      res.status(500).json({
        success: false,
        error: "Unable to reset usage status right now (HTTP 500).",
      });
    }
  });

  /**
   * POST /api/humanize
   * Core endpoint that validates input, checks rate limits, calls Gemini on the server,
   * and returns the humanized text as JSON.
   */
  app.post("/api/humanize", async (req: Request, res: Response) => {
    try {
      const clientId = resolveClientIdentifier(req);
      const currentQuota = await usageStore.getStatus(clientId);

      // 1. Check server AI service configuration before consuming user quota
      if (!isGeminiApiKeyConfigured()) {
        res.status(503).json({
          success: false,
          error:
            "Server setup required: The backend AI service is not configured yet (HTTP 503). Please check your server environment settings to enable text humanization.",
          code: "SERVICE_UNCONFIGURED",
          rateLimit: {
            limit: currentQuota.limit,
            used: currentQuota.used,
            remaining: currentQuota.remaining,
            resetAt: currentQuota.resetAt,
          },
        });
        return;
      }

      // 2. Check free usage rate limit before calling Gemini
      if (!currentQuota.allowed) {
        res.status(429).json({
          success: false,
          error: `You've reached your free daily limit (${currentQuota.limit}/${currentQuota.limit} requests used). Your free quota resets daily at midnight UTC.`,
          code: "DAILY_LIMIT_REACHED",
          rateLimit: {
            limit: currentQuota.limit,
            used: currentQuota.used,
            remaining: 0,
            resetAt: currentQuota.resetAt,
          },
        });
        return;
      }

      // 3. Validate and sanitize request body
      const validation = validateHumanizeRequest(req.body);
      if (!validation.valid || !validation.data) {
        res.status(validation.statusCode || 400).json({
          success: false,
          error:
            validation.error ||
            "Invalid input (HTTP 400). Please check your text and try again.",
          rateLimit: {
            limit: currentQuota.limit,
            used: currentQuota.used,
            remaining: currentQuota.remaining,
            resetAt: currentQuota.resetAt,
          },
        });
        return;
      }

      // 4. Call Gemini API to rewrite text
      const rewrittenText = await humanizeTextWithGemini(validation.data);

      // 5. Consume 1 unit of daily quota after successful processing
      const updatedQuota = await usageStore.consume(clientId);

      // 6. Compute usage stats
      const outputWords = countWords(rewrittenText);
      const outputCharacters = countCharacters(rewrittenText);

      res.json({
        success: true,
        result: rewrittenText,
        usage: {
          words: validation.stats?.words ?? outputWords,
          characters: validation.stats?.characters ?? outputCharacters,
          outputWords,
          outputCharacters,
        },
        rateLimit: {
          limit: updatedQuota.limit,
          used: updatedQuota.used,
          remaining: updatedQuota.remaining,
          resetAt: updatedQuota.resetAt,
        },
      });
    } catch (error: unknown) {
      if (error instanceof GeminiServiceError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.userMessage,
        });
        return;
      }

      console.error("[API /api/humanize] Unexpected error occurred.");
      res.status(500).json({
        success: false,
        error:
          "Something went wrong while processing your text (HTTP 500). Please try again.",
      });
    }
  });

  // Reject unknown /api/* routes with JSON 404 so /api/* never falls through to HTML
  app.all("/api/*", (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `API endpoint not found: ${req.method} ${req.originalUrl} (HTTP 404).`,
    });
  });

  // Serve frontend via Vite in development or static dist in production
  const distPath = path.join(__dirname, "dist");
  const distIndexHtml = path.join(distPath, "index.html");
  const isDevMode = process.env.NODE_ENV === "development";

  if (!isDevMode && fs.existsSync(distIndexHtml)) {
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(distIndexHtml);
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Final catch-all error middleware to guarantee /api/* always returns valid JSON
  app.use(
    (err: Error, req: Request, res: Response, _next: NextFunction) => {
      console.error("[Server Error]", req.method, req.originalUrl, err.message);
      if (req.originalUrl.startsWith("/api")) {
        res.status(500).json({
          success: false,
          error: "Internal server error (HTTP 500). Please try again.",
        });
        return;
      }
      res.status(500).send("Internal Server Error");
    }
  );

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `HumanizeAI server running on http://0.0.0.0:${PORT} (mode: ${isDevMode ? "development" : "production"})`
    );
  });
}

startServer();
