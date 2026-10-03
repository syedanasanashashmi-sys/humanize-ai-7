import {
  HumanizeApiResponse,
  RewriteIntensity,
  SupportedLanguage,
  UsageApiResponse,
  WritingStyle,
} from "../types/humanizer";

const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates or retrieves an anonymous session identifier used only to help
 * track free daily requests consistently during a browser session.
 * No personal or sensitive data is stored.
 */
function getAnonymousSessionId(): string {
  const storageKey = "humanizeai_session_id";
  try {
    let existing = sessionStorage.getItem(storageKey);
    if (!existing) {
      existing =
        "sess_" +
        Math.random().toString(36).substring(2, 12) +
        Date.now().toString(36);
      sessionStorage.setItem(storageKey, existing);
    }
    return existing;
  } catch {
    return "sess_default";
  }
}

interface SafeParsedResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  errorMessage?: string;
  isRetryable: boolean;
}

/**
 * Safely reads and parses an HTTP response body as JSON.
 * Never assumes the server returns valid JSON: checks response.ok and non-empty body
 * before parsing, handles HTML/non-JSON responses without crashing, and logs the full
 * technical error to the browser console.
 */
async function safeParseJsonResponse<
  T extends { success?: boolean; error?: string; code?: string }
>(
  response: Response,
  endpointName: string
): Promise<SafeParsedResponse<T>> {
  const status = response.status;
  const statusLabel = `HTTP ${status}${
    response.statusText ? ` ${response.statusText}` : ""
  }`;
  const is5xx = status >= 500 && status <= 599;

  let rawText = "";
  try {
    rawText = await response.text();
  } catch (readErr) {
    console.error(
      `[HumanizeAI API] Failed to read response body from ${endpointName} (${statusLabel}):`,
      readErr
    );
    return {
      ok: false,
      status,
      errorMessage: "Something went wrong, please try again.",
      isRetryable: is5xx || status === 429,
    };
  }

  const trimmed = rawText.trim();
  if (!trimmed) {
    console.error(
      `[HumanizeAI API] Empty response body from ${endpointName} (${statusLabel}).`
    );
    return {
      ok: false,
      status,
      errorMessage:
        status === 429
          ? "Too many requests, please wait a moment."
          : "Something went wrong, please try again.",
      isRetryable: is5xx || status === 429,
    };
  }

  let parsed: T;
  try {
    parsed = JSON.parse(trimmed) as T;
  } catch (parseErr) {
    console.error(
      `[HumanizeAI API] Non-JSON response from ${endpointName} (${statusLabel}):`,
      {
        status,
        statusText: response.statusText,
        bodyPreview: trimmed.slice(0, 500),
        parseError: parseErr,
      }
    );

    return {
      ok: false,
      status,
      errorMessage:
        status === 429
          ? "Too many requests, please wait a moment."
          : "Something went wrong, please try again.",
      isRetryable: is5xx || status === 429,
    };
  }

  if (!response.ok || parsed.success === false) {
    console.error(
      `[HumanizeAI API] Error response from ${endpointName} (${statusLabel}):`,
      parsed
    );

    const isDailyQuotaLimit = parsed.code === "DAILY_LIMIT_REACHED";
    const isUnconfigured = parsed.code === "SERVICE_UNCONFIGURED";

    let userFriendlyError =
      typeof parsed.error === "string" && parsed.error.trim()
        ? parsed.error.trim()
        : status === 429
          ? "Too many requests, please wait a moment."
          : "Something went wrong, please try again.";

    if (status === 429 && !isDailyQuotaLimit && !parsed.error) {
      userFriendlyError = "Too many requests, please wait a moment.";
    }

    return {
      ok: false,
      status,
      data: parsed,
      errorMessage: userFriendlyError,
      isRetryable:
        !isDailyQuotaLimit && !isUnconfigured && (status === 429 || is5xx),
    };
  }

  return {
    ok: true,
    status,
    data: parsed,
    isRetryable: false,
  };
}

/**
 * Executes a fetch request with automatic retry up to MAX_RETRIES (2 times)
 * on 429 rate-limit or temporary 5xx/network errors.
 */
async function fetchWithRetry<
  T extends { success?: boolean; error?: string; code?: string }
>(
  endpoint: string,
  options: RequestInit,
  timeoutMs = 30000
): Promise<SafeParsedResponse<T>> {
  let lastResult: SafeParsedResponse<T> | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = INITIAL_RETRY_DELAY_MS * attempt;
      console.warn(
        `[HumanizeAI API] Retrying ${endpoint} (attempt ${attempt} of ${MAX_RETRIES}) after ${delay}ms...`
      );
      await sleep(delay);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        ...options,
        signal: controller.signal,
      });

      const parsed = await safeParseJsonResponse<T>(response, endpoint);
      lastResult = parsed;

      if (parsed.ok || !parsed.isRetryable || attempt === MAX_RETRIES) {
        if (!parsed.ok && parsed.status === 429 && parsed.data?.code !== "DAILY_LIMIT_REACHED") {
          return {
            ...parsed,
            errorMessage:
              parsed.errorMessage || "Too many requests, please wait a moment.",
          };
        }
        return parsed;
      }
    } catch (err: unknown) {
      console.error(
        `[HumanizeAI API] Network/fetch error on ${endpoint} (attempt ${attempt + 1}):`,
        err
      );

      const isAbort = err instanceof DOMException && err.name === "AbortError";
      lastResult = {
        ok: false,
        status: isAbort ? 504 : 0,
        errorMessage: isAbort
          ? "The request timed out. Please try again with a shorter passage."
          : "Something went wrong, please try again.",
        isRetryable: !isAbort,
      };

      if (isAbort || attempt === MAX_RETRIES) {
        return lastResult;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return (
    lastResult || {
      ok: false,
      status: 0,
      errorMessage: "Something went wrong, please try again.",
      isRetryable: false,
    }
  );
}

/**
 * Fetches current free usage status and server limits from GET /api/usage.
 */
export async function fetchUsageStatus(): Promise<UsageApiResponse> {
  const endpoint = "/api/usage";
  try {
    const result = await fetchWithRetry<UsageApiResponse>(
      endpoint,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Client-Session": getAnonymousSessionId(),
        },
      },
      15000
    );

    if (!result.ok || !result.data) {
      return {
        success: false,
        error: result.errorMessage || "Something went wrong, please try again.",
      };
    }

    return result.data;
  } catch (err: unknown) {
    console.error(`[HumanizeAI API] Unhandled error in fetchUsageStatus:`, err);
    return {
      success: false,
      error: "Something went wrong, please try again.",
    };
  }
}

/**
 * Resets the current session's daily free usage counter via POST /api/usage/reset.
 */
export async function resetUsageQuota(): Promise<UsageApiResponse> {
  const endpoint = "/api/usage/reset";
  try {
    const result = await fetchWithRetry<UsageApiResponse>(
      endpoint,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Client-Session": getAnonymousSessionId(),
        },
      },
      15000
    );

    if (!result.ok || !result.data) {
      return {
        success: false,
        error: result.errorMessage || "Something went wrong, please try again.",
      };
    }

    return result.data;
  } catch (err: unknown) {
    console.error(`[HumanizeAI API] Unhandled error in resetUsageQuota:`, err);
    return {
      success: false,
      error: "Something went wrong, please try again.",
    };
  }
}

/**
 * Sends text to POST /api/humanize to be rewritten by Gemini on the server.
 */
export async function requestHumanizeText(params: {
  text: string;
  style: WritingStyle;
  intensity: RewriteIntensity;
  language: SupportedLanguage;
}): Promise<HumanizeApiResponse> {
  const endpoint = "/api/humanize";
  try {
    const result = await fetchWithRetry<HumanizeApiResponse>(
      endpoint,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Client-Session": getAnonymousSessionId(),
        },
        body: JSON.stringify(params),
      },
      35000
    );

    if (!result.ok || !result.data) {
      return {
        success: false,
        error: result.errorMessage || "Something went wrong, please try again.",
        code: result.data?.code,
        rateLimit: result.data?.rateLimit,
      };
    }

    return result.data;
  } catch (err: unknown) {
    console.error(
      `[HumanizeAI API] Unhandled error in requestHumanizeText:`,
      err
    );
    return {
      success: false,
      error: "Something went wrong, please try again.",
    };
  }
}
