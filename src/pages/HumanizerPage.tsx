import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  ClipboardPaste,
  Copy,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_LIMITS,
  RateLimitInfo,
  REWRITE_INTENSITIES,
  RewriteIntensity,
  SAMPLE_DEMO_TEXT,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  WRITING_STYLES,
  WritingStyle,
} from "../types/humanizer";
import {
  copyToClipboard,
  countCharacters,
  countWords,
  downloadTextFile,
} from "../utils/textMetrics";
import {
  fetchUsageStatus,
  requestHumanizeText,
  resetUsageQuota,
} from "../services/api";

interface HumanizerPageProps {
  initialText?: string;
  initialStyle?: WritingStyle;
}

export const HumanizerPage: React.FC<HumanizerPageProps> = ({
  initialText = "",
  initialStyle,
}) => {
  const [originalText, setOriginalText] = useState<string>(initialText);
  const [humanizedText, setHumanizedText] = useState<string>("");
  const [style, setStyle] = useState<WritingStyle>(initialStyle || "natural");
  const [intensity, setIntensity] = useState<RewriteIntensity>("balanced");
  const [language, setLanguage] = useState<SupportedLanguage>("English");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);

  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    limit: DEFAULT_LIMITS.dailyRequests,
    used: 0,
    remaining: DEFAULT_LIMITS.dailyRequests,
  });

  const [limits, setLimits] = useState({
    maxWords: DEFAULT_LIMITS.maxWords,
    maxCharacters: DEFAULT_LIMITS.maxCharacters,
    dailyRequests: DEFAULT_LIMITS.dailyRequests,
  });

  const [apiConfigured, setApiConfigured] = useState<boolean>(true);

  useEffect(() => {
    if (initialText) {
      setOriginalText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (initialStyle) {
      setStyle(initialStyle);
    }
  }, [initialStyle]);

  useEffect(() => {
    let mounted = true;
    fetchUsageStatus().then((res) => {
      if (!mounted) return;
      if (res.rateLimit) {
        setRateLimit(res.rateLimit);
      }
      if (res.limits) {
        setLimits(res.limits);
      }
      if (typeof res.apiConfigured === "boolean") {
        setApiConfigured(res.apiConfigured);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const inputWords = countWords(originalText);
  const inputCharacters = countCharacters(originalText);
  const outputWords = countWords(humanizedText);
  const outputCharacters = countCharacters(humanizedText);

  const isOverLimit =
    inputWords > limits.maxWords || inputCharacters > limits.maxCharacters;

  const selectedStyleObj = WRITING_STYLES.find((s) => s.value === style);
  const selectedIntensityObj = REWRITE_INTENSITIES.find(
    (i) => i.value === intensity
  );

  const handlePasteFromClipboard = async () => {
    setErrorMessage(null);
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          setOriginalText(clipText);
          return;
        }
      }
      setErrorMessage(
        "Clipboard access requires browser permission. Please press Ctrl+V (or Cmd+V on Mac) inside the text box to paste."
      );
    } catch {
      setErrorMessage(
        "Clipboard access is restricted by your browser. Please press Ctrl+V (or Cmd+V on Mac) inside the text box to paste."
      );
    }
  };

  const handleLoadSample = () => {
    setErrorMessage(null);
    setConfirmClearAll(false);
    setOriginalText(SAMPLE_DEMO_TEXT);
  };

  const handleClearOriginal = () => {
    setErrorMessage(null);
    setConfirmClearAll(false);
    setOriginalText("");
  };

  const handleClearResult = () => {
    setErrorMessage(null);
    setConfirmClearAll(false);
    setHumanizedText("");
    setCopied(false);
  };

  const handleRequestClearAll = () => {
    setErrorMessage(null);
    if (originalText.trim() && humanizedText.trim()) {
      setConfirmClearAll(true);
    } else {
      setOriginalText("");
      setHumanizedText("");
      setCopied(false);
      setConfirmClearAll(false);
    }
  };

  const executeClearAll = () => {
    setOriginalText("");
    setHumanizedText("");
    setErrorMessage(null);
    setCopied(false);
    setConfirmClearAll(false);
  };

  const handleCopyResult = async () => {
    if (!humanizedText) return;
    const ok = await copyToClipboard(humanizedText);
    if (ok) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      setErrorMessage(
        "Could not copy automatically. Please select the text and press Ctrl+C (or Cmd+C)."
      );
    }
  };

  const handleDownloadTxt = () => {
    if (!humanizedText) return;
    downloadTextFile(humanizedText, "humanized-text.txt");
  };

  const handleResetQuota = async () => {
    const res = await resetUsageQuota();
    if (res.rateLimit) {
      setRateLimit(res.rateLimit);
      setErrorMessage(null);
    }
  };

  const handleHumanize = async () => {
    if (isLoading) return;
    setErrorMessage(null);
    setConfirmClearAll(false);

    // 1. Validate that text exists
    const trimmed = originalText.trim();
    if (!trimmed) {
      setErrorMessage("No text entered. Please paste some text first.");
      return;
    }

    if (trimmed.length < 10) {
      setErrorMessage(
        "Please enter at least 10 characters so we have enough context to improve your writing."
      );
      return;
    }

    // 2. Validate maximum length
    if (isOverLimit) {
      setErrorMessage(
        "Your text is too long. Please shorten it and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestHumanizeText({
        text: trimmed,
        style,
        intensity,
        language,
      });

      if (response.rateLimit) {
        setRateLimit(response.rateLimit);
      }

      if (!response.success || !response.result) {
        setErrorMessage(
          response.error || "Something went wrong. Please try again."
        );
        return;
      }

      setHumanizedText(response.result);
      setCopied(false);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header & Free Usage Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Humanizer Tool
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Improve clarity, flow, tone, and readability while keeping your
            original meaning.
          </p>
        </div>

        {/* Free Usage Counter */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 font-medium shrink-0">
          <span>
            Free uses remaining:{" "}
            <strong className="font-mono-tabular text-slate-900">
              {rateLimit.remaining}/{rateLimit.limit}
            </strong>
          </span>
          {rateLimit.remaining === 0 && (
            <>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                type="button"
                onClick={handleResetQuota}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Reset Counter
              </button>
            </>
          )}
          {(originalText || humanizedText) && (
            <>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                type="button"
                onClick={handleRequestClearAll}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Server Service Availability Notice */}
      {!apiConfigured && (
        <div
          role="status"
          className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3"
        >
          <AlertCircle
            className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">AI Service Setup Required</p>
            <p className="mt-0.5 text-amber-800">
              The backend AI rewriting service is not configured yet. Please
              complete the server environment setup in your project settings and
              restart the server.
            </p>
          </div>
        </div>
      )}

      {/* Inline Confirmation for Clear All */}
      {confirmClearAll && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-slate-900 text-white text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <span>
            Are you sure you want to clear both your original text and humanized
            result?
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={executeClearAll}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              onClick={() => setConfirmClearAll(false)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-medium text-red-700 hover:text-red-900 underline shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Bar (Clearly separated from text areas) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Writing Style Dropdown */}
          <div className="lg:col-span-4">
            <label
              htmlFor="style-select"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Writing Style
            </label>
            <select
              id="style-select"
              value={style}
              onChange={(e) => setStyle(e.target.value as WritingStyle)}
              disabled={isLoading}
              className="w-full h-11 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {WRITING_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedStyleObj && (
              <p
                className="text-xs text-slate-500 mt-1 truncate"
                title={selectedStyleObj.description}
              >
                {selectedStyleObj.description}
              </p>
            )}
          </div>

          {/* Intensity Dropdown */}
          <div className="lg:col-span-3">
            <label
              htmlFor="intensity-select"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Intensity
            </label>
            <select
              id="intensity-select"
              value={intensity}
              onChange={(e) =>
                setIntensity(e.target.value as RewriteIntensity)
              }
              disabled={isLoading}
              className="w-full h-11 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {REWRITE_INTENSITIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedIntensityObj && (
              <p
                className="text-xs text-slate-500 mt-1 truncate"
                title={selectedIntensityObj.description}
              >
                {selectedIntensityObj.description}
              </p>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="lg:col-span-2">
            <label
              htmlFor="language-select"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as SupportedLanguage)
              }
              disabled={isLoading}
              className="w-full h-11 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1 truncate">
              Standard English
            </p>
          </div>

          {/* Primary Prominent Action Button */}
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="button"
              onClick={handleHumanize}
              disabled={isLoading}
              aria-label={isLoading ? "Humanizing text" : "Humanize Text"}
              className="w-full h-11 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin shrink-0"
                    aria-hidden="true"
                  />
                  <span>✨ Humanizing...</span>
                </>
              ) : (
                <span>✨ Humanize Text</span>
              )}
            </button>
            <p className="text-xs text-slate-500 mt-1 text-center lg:text-left">
              Preserves meaning &amp; key facts
            </p>
          </div>
        </div>
      </div>

      {/* Two-Panel Editor (Side-by-side on desktop, stacked vertically on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: Original Text */}
        <section
          aria-labelledby="original-text-heading"
          className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden"
        >
          {/* Panel Header */}
          <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70">
            <label
              id="original-text-heading"
              htmlFor="original-text-input"
              className="text-sm font-semibold text-slate-900 cursor-pointer"
            >
              Original Text
            </label>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                Sample Text
              </button>

              <button
                type="button"
                onClick={handlePasteFromClipboard}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <ClipboardPaste className="w-3.5 h-3.5" aria-hidden="true" />
                Paste
              </button>

              <button
                type="button"
                onClick={handleClearOriginal}
                disabled={isLoading || !originalText}
                aria-label="Clear Original Text"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 flex flex-col">
            <textarea
              id="original-text-input"
              value={originalText}
              onChange={(e) => {
                setOriginalText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={isLoading}
              placeholder="Paste your AI-assisted text here..."
              rows={15}
              className="w-full flex-1 min-h-[340px] p-4 sm:p-5 text-base text-slate-900 placeholder:text-slate-400 bg-white resize-y focus:outline-none leading-relaxed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          {/* Panel Footer: Live Word & Character Counter */}
          <div className="px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 font-mono-tabular">
              <span
                className={
                  inputWords > limits.maxWords
                    ? "text-red-600 font-semibold"
                    : "text-slate-600"
                }
              >
                Words:{" "}
                <strong className="text-slate-900">
                  {inputWords.toLocaleString()}
                </strong>{" "}
                / {limits.maxWords.toLocaleString()}
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span
                className={
                  inputCharacters > limits.maxCharacters
                    ? "text-red-600 font-semibold"
                    : "text-slate-600"
                }
              >
                Characters:{" "}
                <strong className="text-slate-900">
                  {inputCharacters.toLocaleString()}
                </strong>{" "}
                / {limits.maxCharacters.toLocaleString()}
              </span>
            </div>

            {isOverLimit && (
              <span className="text-red-600 font-semibold">
                Maximum input limit exceeded
              </span>
            )}
          </div>
        </section>

        {/* RIGHT PANEL: Humanized Text */}
        <section
          aria-labelledby="humanized-text-heading"
          aria-live="polite"
          className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden"
        >
          {/* Panel Header */}
          <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70">
            <label
              id="humanized-text-heading"
              htmlFor="humanized-text-output"
              className="text-sm font-semibold text-slate-900"
            >
              Humanized Text
            </label>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleCopyResult}
                disabled={!humanizedText || isLoading}
                aria-label="Copy humanized text"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  copied
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {copied ? (
                  <>
                    <Check
                      className="w-3.5 h-3.5 text-emerald-600"
                      aria-hidden="true"
                    />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copy
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                disabled={!humanizedText || isLoading}
                aria-label="Download humanized text as .txt file"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Download .txt
              </button>

              <button
                type="button"
                onClick={handleClearResult}
                disabled={!humanizedText || isLoading}
                aria-label="Clear Humanized Text"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            </div>
          </div>

          {/* Output Body: Empty State / Loading State / Editable Success State */}
          <div className="flex-1 min-h-[340px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 py-12">
                <Loader2
                  className="w-7 h-7 text-blue-600 animate-spin mb-3.5"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-slate-900">
                  ✨ Humanizing your text...
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Improving clarity, sentence flow, and tone while preserving
                  your original meaning.
                </p>
                <div
                  aria-hidden="true"
                  className="w-full max-w-xs mt-5 space-y-2"
                >
                  <div className="h-2 bg-slate-100 rounded animate-pulse w-full" />
                  <div className="h-2 bg-slate-100 rounded animate-pulse w-5/6 mx-auto" />
                  <div className="h-2 bg-slate-100 rounded animate-pulse w-4/6 mx-auto" />
                </div>
              </div>
            ) : humanizedText ? (
              <textarea
                id="humanized-text-output"
                aria-label="Humanized text result (editable)"
                value={humanizedText}
                onChange={(e) => setHumanizedText(e.target.value)}
                rows={15}
                className="w-full flex-1 min-h-[340px] p-4 sm:p-5 text-base text-slate-900 bg-white resize-y focus:outline-none leading-relaxed"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 py-12 text-slate-400">
                <FileText
                  className="w-8 h-8 text-slate-300 mb-3 stroke-[1.5]"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-slate-500">
                  Your humanized text will appear here
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Paste your draft on the left, choose your style and intensity,
                  and click Humanize Text.
                </p>
              </div>
            )}
          </div>

          {/* Mobile-Friendly Quick Action Bar when result is ready */}
          {humanizedText && !isLoading && (
            <div className="sm:hidden px-4 py-3 border-t border-slate-200 bg-white grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleCopyResult}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check
                      className="w-3.5 h-3.5 text-emerald-600"
                      aria-hidden="true"
                    />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copy
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Download .txt
              </button>
              <button
                type="button"
                onClick={handleClearResult}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 text-xs font-semibold text-slate-700 hover:text-red-600 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            </div>
          )}

          {/* Panel Footer: Result Stats & Mobile Action Bar */}
          <div className="px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-3 font-mono-tabular">
              <span>
                Words:{" "}
                <strong className="text-slate-900">
                  {outputWords.toLocaleString()}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>
                Characters:{" "}
                <strong className="text-slate-900">
                  {outputCharacters.toLocaleString()}
                </strong>
              </span>
            </div>
            <span className="text-slate-500">
              {humanizedText
                ? "You can edit the result directly above before copying"
                : "Always review output for accuracy before publishing"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
