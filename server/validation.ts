import {
  APP_CONFIG,
  type RewriteIntensity,
  type SupportedLanguage,
  type WritingStyle,
} from "./config.ts";

export interface HumanizeRequestInput {
  text: string;
  style: WritingStyle;
  intensity: RewriteIntensity;
  language: SupportedLanguage;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  statusCode?: number;
  data?: HumanizeRequestInput;
  stats?: {
    words: number;
    characters: number;
  };
}

/**
 * Counts words accurately in a given text string.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Counts characters in a given text string.
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Normalizes and validates incoming POST /api/humanize payload.
 * Treats all client input as untrusted.
 */
export function validateHumanizeRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      statusCode: 400,
      error: "Invalid request format. Please try again.",
    };
  }

  const raw = body as Record<string, unknown>;

  // 1. Validate text existence & type
  if (typeof raw.text !== "string") {
    return {
      valid: false,
      statusCode: 400,
      error: "No text entered. Please paste some text first.",
    };
  }

  // Normalize line breaks and strip null bytes
  const sanitizedText = raw.text
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!sanitizedText) {
    return {
      valid: false,
      statusCode: 400,
      error: "No text entered. Please paste some text first.",
    };
  }

  if (sanitizedText.length < APP_CONFIG.MIN_INPUT_CHARACTERS) {
    return {
      valid: false,
      statusCode: 400,
      error: `Please enter at least ${APP_CONFIG.MIN_INPUT_CHARACTERS} characters so we have enough context to improve your writing.`,
    };
  }

  const characters = countCharacters(sanitizedText);
  const words = countWords(sanitizedText);

  // 2. Enforce maximum length limits (both characters and words)
  if (
    characters > APP_CONFIG.MAX_INPUT_CHARACTERS ||
    words > APP_CONFIG.MAX_INPUT_WORDS
  ) {
    return {
      valid: false,
      statusCode: 400,
      error: `Your text is too long (${words.toLocaleString()} words / ${characters.toLocaleString()} characters). Maximum allowed is ${APP_CONFIG.MAX_INPUT_WORDS.toLocaleString()} words or ${APP_CONFIG.MAX_INPUT_CHARACTERS.toLocaleString()} characters.`,
    };
  }

  // 3. Validate writing style
  const rawStyle =
    typeof raw.style === "string" ? raw.style.toLowerCase().trim() : "natural";
  if (
    !APP_CONFIG.ALLOWED_STYLES.includes(rawStyle as WritingStyle)
  ) {
    return {
      valid: false,
      statusCode: 400,
      error:
        "Invalid writing style selected. Please choose a valid style from the menu.",
    };
  }

  // 4. Validate intensity
  const rawIntensity =
    typeof raw.intensity === "string"
      ? raw.intensity.toLowerCase().trim()
      : "balanced";
  if (
    !APP_CONFIG.ALLOWED_INTENSITIES.includes(rawIntensity as RewriteIntensity)
  ) {
    return {
      valid: false,
      statusCode: 400,
      error:
        "Invalid rewrite intensity selected. Please choose Light, Balanced, or Strong.",
    };
  }

  // 5. Validate language
  const rawLanguage =
    typeof raw.language === "string" ? raw.language.trim() : "English";
  if (
    !APP_CONFIG.ALLOWED_LANGUAGES.includes(rawLanguage as SupportedLanguage)
  ) {
    return {
      valid: false,
      statusCode: 400,
      error: "Selected language is not currently supported. Please choose English.",
    };
  }

  return {
    valid: true,
    data: {
      text: sanitizedText,
      style: rawStyle as WritingStyle,
      intensity: rawIntensity as RewriteIntensity,
      language: rawLanguage as SupportedLanguage,
    },
    stats: {
      words,
      characters,
    },
  };
}
