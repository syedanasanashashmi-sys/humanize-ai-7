import dotenv from "dotenv";

dotenv.config();

/**
 * ============================================================================
 * GEMINI MODEL CONSTANTS (Single place to update if the model changes)
 * ============================================================================
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
export const FALLBACK_GEMINI_MODEL = "gemini-3.1-flash-lite";

/**
 * ============================================================================
 * HUMANIZEAI CENTRAL CONFIGURATION
 * ============================================================================
 * You can easily customize your application's limits, AI model, and settings
 * right here or by setting the corresponding environment variables.
 */

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const APP_CONFIG = {
  /**
   * Daily free humanization requests allowed per user/IP/session.
   * Change this number (or set DAILY_FREE_LIMIT in .env) to adjust free usage.
   */
  DAILY_REQUEST_LIMIT: parsePositiveInt(process.env.DAILY_FREE_LIMIT, 5),

  /**
   * Maximum number of words allowed in a single request.
   * Change this number (or set MAX_INPUT_WORDS in .env) to adjust word limit.
   */
  MAX_INPUT_WORDS: parsePositiveInt(process.env.MAX_INPUT_WORDS, 2000),

  /**
   * Maximum number of characters allowed in a single request.
   * Change this number (or set MAX_INPUT_CHARACTERS in .env) to adjust character limit.
   */
  MAX_INPUT_CHARACTERS: parsePositiveInt(process.env.MAX_INPUT_CHARACTERS, 12000),

  /**
   * Minimum number of characters required to process text.
   */
  MIN_INPUT_CHARACTERS: 10,

  /**
   * Timeout in milliseconds for the AI rewriting request (30 seconds).
   */
  REQUEST_TIMEOUT_MS: 30000,

  /**
   * Maximum automatic retries on transient 429 / 5xx errors.
   */
  MAX_RETRIES: 2,

  /**
   * Gemini model used for text humanization.
   * Configurable via the GEMINI_MODEL environment variable.
   */
  GEMINI_MODEL: (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL).trim(),

  /**
   * Fallback Gemini model used if the primary model is overloaded or rate-limited.
   */
  FALLBACK_GEMINI_MODEL,

  /**
   * Supported writing styles.
   */
  ALLOWED_STYLES: [
    "natural",
    "professional",
    "casual",
    "academic",
    "friendly",
    "concise",
  ] as const,

  /**
   * Supported rewrite intensities.
   */
  ALLOWED_INTENSITIES: ["light", "balanced", "strong"] as const,

  /**
   * Supported languages.
   */
  ALLOWED_LANGUAGES: ["English"] as const,
};

export type WritingStyle = (typeof APP_CONFIG.ALLOWED_STYLES)[number];
export type RewriteIntensity = (typeof APP_CONFIG.ALLOWED_INTENSITIES)[number];
export type SupportedLanguage = (typeof APP_CONFIG.ALLOWED_LANGUAGES)[number];

/**
 * Retrieves the Gemini API key from server environment variables.
 * Supports GEMINI_API_KEY (primary) as well as API_KEY / GOOGLE_API_KEY fallbacks
 * for cloud deployment environments. Never exposed to the client.
 */
export function getGeminiApiKey(): string | undefined {
  const candidates = [
    process.env.GEMINI_API_KEY,
    process.env.API_KEY,
    process.env.GOOGLE_API_KEY,
  ];

  for (const raw of candidates) {
    const key = raw?.trim();
    if (
      key &&
      key !== "MY_GEMINI_API_KEY" &&
      key !== "YOUR_API_KEY_HERE" &&
      key.length > 10
    ) {
      return key;
    }
  }
  return undefined;
}

/**
 * Helper to check if the server has a valid-looking Gemini API key configured.
 * Never returns or logs the key itself.
 */
export function isGeminiApiKeyConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}
