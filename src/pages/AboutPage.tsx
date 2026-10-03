import React from "react";
import { PageRoute } from "../types/humanizer";

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          About HumanizeAI
        </h1>
        <p className="mt-3 text-lg text-slate-600 leading-relaxed">
          Helping writers, professionals, and teams refine AI-assisted drafts
          into clear, natural, and readable communication.
        </p>
      </header>

      <div className="mt-10 space-y-10 text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Our Purpose</h2>
          <p>
            AI writing tools are helpful for brainstorming, outlining, and
            generating first drafts. However, raw AI-generated text often sounds
            stiff, repetitive, overly formal, or cluttered with predictable
            transition phrases.
          </p>
          <p>
            <strong>HumanizeAI</strong> was built to bridge the gap between an
            initial AI-assisted draft and polished, natural prose. Our goal is
            simple: improve clarity, sentence flow, tone, and readability while
            keeping your original meaning and factual details intact.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            What Makes HumanizeAI Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Meaning &amp; Fact Preservation
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Unlike generic spinners that swap words with awkward synonyms,
                HumanizeAI focuses on natural sentence structure while keeping
                your names, numbers, citations, URLs, and key points accurate.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Tailored Styles &amp; Intensity
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Choose from six distinct writing styles—Natural, Professional,
                Casual, Academic, Friendly, and Concise—paired with Light,
                Balanced, or Strong rewrite intensity.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 border border-slate-200 rounded-xl p-6 space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            Our Commitment to Honest Claims
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We believe software tools should be transparent about what they do.
            HumanizeAI is an editorial writing assistant designed to make text
            sound more natural and readable to human audiences.{" "}
            <strong>
              It is not an AI detector bypass tool, and we never claim that
              rewritten text is "100% undetectable" or guaranteed to pass third-party
              AI classifiers.
            </strong>{" "}
            We encourage users to use AI writing tools responsibly and always
            review their final text before publishing or submitting it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p className="text-sm sm:text-base text-slate-600">
            For questions, feedback, or partnership inquiries, please email us
            at{" "}
            <a
              href="mailto:hello@example.com"
              className="text-blue-600 font-semibold hover:underline"
            >
              hello@example.com
            </a>{" "}
            <span className="text-slate-500 text-xs">
              (Placeholder — replace with your actual business email address)
            </span>
            .
          </p>
        </section>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => onNavigate("humanizer")}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
          >
            Open Humanizer Tool
          </button>
        </div>
      </div>
    </div>
  );
};
