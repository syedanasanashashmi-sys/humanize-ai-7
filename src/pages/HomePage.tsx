import React, { useState } from "react";
import { ArrowRight, FileText, Mail } from "lucide-react";
import {
  PageRoute,
  SAMPLE_DEMO_TEXT,
  WRITING_STYLES,
  WritingStyle,
} from "../types/humanizer";
import { FAQ_ITEMS } from "./FaqPage";

interface HomePageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onOpenSampleInTool: (sampleText: string, style?: WritingStyle) => void;
}

const PREVIEW_EXAMPLES: Record<
  WritingStyle,
  { label: string; intensity: string; output: string }
> = {
  natural: {
    label: "Natural",
    intensity: "Balanced",
    output:
      "Artificial intelligence now plays a central role in everyday life. Across industries, it is reshaping how people work, collaborate, and communicate with one another.",
  },
  professional: {
    label: "Professional",
    intensity: "Balanced",
    output:
      "Artificial intelligence has become a vital technology across modern industries, fundamentally transforming workplace operations and professional communication.",
  },
  casual: {
    label: "Casual",
    intensity: "Balanced",
    output:
      "AI has become a huge part of everyday life. It's showing up in all kinds of industries and changing how we get work done and talk to each other.",
  },
  academic: {
    label: "Academic",
    intensity: "Balanced",
    output:
      "Artificial intelligence has emerged as a pivotal technology in contemporary society, significantly influencing industrial practices and modes of human communication.",
  },
  friendly: {
    label: "Friendly",
    intensity: "Balanced",
    output:
      "Artificial intelligence has become such an important part of our world today. Across so many industries, it is helping transform the way we work and connect with one another.",
  },
  concise: {
    label: "Concise",
    intensity: "Balanced",
    output:
      "Artificial intelligence is now essential across industries, transforming how people work and communicate.",
  },
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSampleInTool,
}) => {
  const [previewStyle, setPreviewStyle] = useState<WritingStyle>("natural");

  const currentPreview = PREVIEW_EXAMPLES[previewStyle];
  const homeFaqItems = FAQ_ITEMS.slice(0, 8);

  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide mb-3">
              ✨ AI Writing Assistant
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
              Make AI-Assisted Writing Sound More Natural
            </h1>
            <p className="mt-5 text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Improve clarity, flow, tone, and readability while keeping your
              original meaning.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate("humanizer")}
                className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                ✨ Humanize Text
              </button>
              <button
                type="button"
                onClick={() => onNavigate("home", "how-it-works")}
                className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* REALISTIC PREVIEW OF THE HUMANIZER TOOL */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Preview Top Controls Bar */}
              <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <FileText
                    className="w-4 h-4 text-blue-600 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-slate-900">
                    Humanizer Tool Preview
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline">
                    ·
                  </span>
                  <span className="hidden sm:inline">
                    Select a writing style to compare output
                  </span>
                </div>

                {/* Style Selector Buttons */}
                <div
                  role="group"
                  aria-label="Preview Writing Style"
                  className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
                >
                  {WRITING_STYLES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setPreviewStyle(s.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        previewStyle === s.value
                          ? "bg-white text-slate-900 shadow-xs font-semibold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two-Column Preview Editor Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Left Panel: Original Text */}
                <div className="p-5 sm:p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-slate-900">
                        Original Text
                      </span>
                      <span className="font-mono-tabular">
                        Words: 28 · Characters: 189
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {SAMPLE_DEMO_TEXT}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>AI-assisted first draft</span>
                    <span>Intensity: Balanced</span>
                  </div>
                </div>

                {/* Right Panel: Humanized Text */}
                <div className="p-5 sm:p-6 bg-slate-50/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-blue-600">
                        Humanized Text ({currentPreview.label})
                      </span>
                      <span className="font-mono-tabular">
                        Words: {currentPreview.output.split(/\s+/).length} ·
                        Characters: {currentPreview.output.length}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
                      {currentPreview.output}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">
                      Original meaning preserved
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenSampleInTool(SAMPLE_DEMO_TEXT, previewStyle)
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Open in Humanizer
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              How It Works
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Refine your AI-assisted drafts into clear, natural writing in four
              simple steps.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-mono-tabular font-semibold text-blue-600">
                01
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Paste
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Paste your AI-assisted text.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-mono-tabular font-semibold text-blue-600">
                02
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Customize
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Choose your writing style and intensity.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-mono-tabular font-semibold text-blue-600">
                03
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Humanize
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Let the AI improve the wording and flow.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-mono-tabular font-semibold text-blue-600">
                04
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Copy
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Use your improved text anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Features
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Practical editorial tools designed for clarity, readability, and
              meaning preservation.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <p className="text-xs font-mono-tabular text-blue-600 font-semibold">
                01
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Natural Writing
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Improve wording, flow, and sentence structure.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <p className="text-xs font-mono-tabular text-blue-600 font-semibold">
                02
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Preserve Meaning
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Keep the original ideas, facts, and important details.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <p className="text-xs font-mono-tabular text-blue-600 font-semibold">
                03
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Flexible Styles
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Choose Natural, Professional, Casual, Academic, Friendly, or
                Concise.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <p className="text-xs font-mono-tabular text-blue-600 font-semibold">
                04
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Simple &amp; Fast
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Paste your text, choose your settings, and get an improved
                version.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WRITING STYLES SECTION */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Writing Styles for Every Context
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Match the tone of your audience while keeping your core facts and
              message intact.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WRITING_STYLES.map((styleItem) => (
              <div
                key={styleItem.value}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {styleItem.label}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {styleItem.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenSampleInTool("", styleItem.value)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Use {styleItem.label} style
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Straightforward answers about how HumanizeAI works.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("faq")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              View full FAQ page
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4">
            {homeFaqItems.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/40 shadow-xs"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Contact</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Have questions, feedback, or support inquiries? Reach out by email:
          </p>
          <div className="mt-5 inline-flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-xs text-sm font-medium text-slate-900">
            <Mail className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <a
              href="mailto:hello@example.com"
              className="text-blue-600 hover:underline font-semibold"
            >
              hello@example.com
            </a>
          </div>
          <p className="mt-2.5 text-xs text-slate-500">
            Note for site owner: <code className="font-mono">hello@example.com</code>{" "}
            is a placeholder email address. Replace it with your real business
            email before launching publicly.
          </p>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Ready to improve your writing?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Paste your draft, pick a tone that fits your audience, and get
            clearer, more natural writing in seconds.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => onNavigate("humanizer")}
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              ✨ Humanize Text
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
