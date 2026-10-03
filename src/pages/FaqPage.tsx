import React from "react";
import { PageRoute } from "../types/humanizer";

interface FaqPageProps {
  onNavigate: (page: PageRoute) => void;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is HumanizeAI?",
    answer:
      "HumanizeAI is an AI-assisted writing improvement web application that helps you transform stiff, repetitive, or overly mechanical drafts into clearer, more natural, and engaging writing while preserving your original meaning.",
  },
  {
    question: "How does HumanizeAI work?",
    answer:
      "Paste your text into the editor, choose your preferred writing style and rewrite intensity, and click Humanize Text. Our server processes your request with a tailored editorial prompt via the Google Gemini API to smooth out transitions, vary sentence structure naturally, and improve clarity.",
  },
  {
    question: "What writing styles are supported?",
    answer:
      "HumanizeAI supports six distinct writing styles: Natural (conversational and clear), Professional (polished for business communication), Casual (relaxed and approachable), Academic (formal, structured, and cautious), Friendly (warm and personable), and Concise (trimmed of unnecessary filler). You can pair any style with Light, Balanced, or Strong intensity.",
  },
  {
    question: "How much text can I process?",
    answer:
      "Each request supports up to 2,000 words or 12,000 characters. For longer documents or articles, we recommend processing your text section by section for the highest editorial precision.",
  },
  {
    question: "Is HumanizeAI free?",
    answer:
      "Yes. HumanizeAI includes 5 free humanization requests per day per session so you can test and improve your writing at no cost.",
  },
  {
    question: "Do you store my text?",
    answer:
      "No. HumanizeAI processes your submitted text in memory solely to generate your rewritten result and does not permanently save or archive your text in a database.",
  },
  {
    question: "Can I edit the result?",
    answer:
      "Yes! Once your humanized text appears in the right-hand panel, you can edit the text directly inside the result box before copying it or downloading it as a .txt file.",
  },
  {
    question: "Does HumanizeAI guarantee AI detector results?",
    answer:
      "No. No AI detection result can be guaranteed. Third-party AI detectors use varying, unproven heuristics that frequently misclassify both human and AI-assisted writing. HumanizeAI is built to improve genuine readability, sentence flow, and clarity for human readers—not as an AI detector bypass guarantee.",
  },
  {
    question: "Does HumanizeAI change the meaning of my text?",
    answer:
      "No. Our system instructions strictly preserve your original ideas, facts, proper names, numbers, dates, URLs, and citations. We always recommend reviewing your final output to ensure every detail matches your intent.",
  },
  {
    question: "Can I use the output commercially?",
    answer:
      "Yes. You retain full responsibility and usage rights for the content you submit and the rewritten output you generate, subject to our Terms of Service.",
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          Honest, straightforward answers about how HumanizeAI works, supported
          writing styles, usage limits, and privacy.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <article
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs"
          >
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              {item.question}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              {item.answer}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Ready to improve your writing?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Paste your text, choose your style, and refine your draft in seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("humanizer")}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          ✨ Humanize Text
        </button>
      </div>
    </div>
  );
};
