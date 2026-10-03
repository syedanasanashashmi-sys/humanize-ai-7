export type WritingStyle =
  | "natural"
  | "professional"
  | "casual"
  | "academic"
  | "friendly"
  | "concise";

export type RewriteIntensity = "light" | "balanced" | "strong";

export type SupportedLanguage = "English";

export type PageRoute =
  | "home"
  | "humanizer"
  | "about"
  | "faq"
  | "privacy"
  | "terms";

export interface StyleOption {
  value: WritingStyle;
  label: string;
  description: string;
}

export interface IntensityOption {
  value: RewriteIntensity;
  label: string;
  description: string;
}

export const WRITING_STYLES: StyleOption[] = [
  {
    value: "natural",
    label: "Natural",
    description: "Conversational, clear, varied, and human-sounding.",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Polished, precise, and suited for workplace communication.",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed, approachable, and conversational.",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Formal, structured, precise, and appropriately cautious.",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm, approachable, and natural.",
  },
  {
    value: "concise",
    label: "Concise",
    description: "Removes unnecessary words while keeping core meaning.",
  },
];

export const REWRITE_INTENSITIES: IntensityOption[] = [
  {
    value: "light",
    label: "Light",
    description: "Minimal changes to fix awkward phrasing and improve clarity.",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Meaningful improvements to flow, structure, and wording.",
  },
  {
    value: "strong",
    label: "Strong",
    description: "Substantial sentence restructuring while keeping all facts.",
  },
];

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["English"];

export const SAMPLE_DEMO_TEXT =
  "Artificial intelligence has become an increasingly important technology in modern society. It is being used in many different industries and has changed the way people work and communicate.";

export const DEFAULT_LIMITS = {
  dailyRequests: 5,
  maxWords: 2000,
  maxCharacters: 12000,
};

export interface RateLimitInfo {
  limit: number;
  used: number;
  remaining: number;
  resetAt?: string;
}

export interface HumanizeApiResponse {
  success: boolean;
  result?: string;
  error?: string;
  code?: string;
  usage?: {
    words: number;
    characters: number;
    outputWords?: number;
    outputCharacters?: number;
  };
  rateLimit?: RateLimitInfo;
}

export interface UsageApiResponse {
  success: boolean;
  rateLimit?: RateLimitInfo;
  limits?: {
    maxWords: number;
    maxCharacters: number;
    dailyRequests: number;
  };
  apiConfigured?: boolean;
  error?: string;
}
