import React from "react";

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last Updated: October 2026 · Template Notice: This document is a
          template and should be reviewed by qualified legal counsel and
          customized with your business details before commercial launch.
        </p>
      </header>

      <div className="mt-8 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong>HumanizeAI</strong> ("the Service"),
            operated by [Your Company/Business Name] ("we", "us", or "our"), you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            2. Description of Service &amp; No Detector Guarantees
          </h2>
          <p>
            HumanizeAI is an AI-assisted writing improvement tool designed to
            help users refine the clarity, flow, tone, and readability of their
            text.
          </p>
          <p>
            <strong>No Guarantee of Originality or Detector Results:</strong>{" "}
            HumanizeAI is <strong>not</strong> an AI detector bypass service. We
            make no representations, warranties, or guarantees that text
            processed by HumanizeAI will be classified as "human-written" or
            pass any third-party AI detection tool, plagiarism checker, or
            academic/institutional evaluation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            3. User Responsibilities &amp; Acceptable Use
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              You are solely responsible for the text you submit to the Service
              and for how you use the resulting output.
            </li>
            <li>
              You must not submit unlawful, defamatory, infringing, harmful, or
              abusive content, or content that violates the rights of any third
              party.
            </li>
            <li>
              You are responsible for ensuring that your use of AI-assisted
              writing tools complies with any applicable academic, workplace,
              publishing, or professional policies.
            </li>
            <li>
              You agree not to attempt to bypass rate limits, overload the
              server, or interfere with the security of the Service.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            4. Accuracy of AI Output &amp; Mandatory Review
          </h2>
          <p>
            AI-generated and AI-rewritten text may occasionally contain errors,
            inaccuracies, unintended phrasing changes, or omissions. You must
            carefully review and verify all output for factual accuracy,
            appropriateness, and completeness before relying on, publishing, or
            distributing it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            5. Disclaimer of Warranties ("As-Is")
          </h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
            WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
            WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
            COMPLETELY SECURE.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            6. Limitation of Liability (Placeholder)
          </h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, [YOUR
            COMPANY/BUSINESS NAME] AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
            ANY LOSS OF PROFITS, DATA, REPUTATION, OR ACADEMIC/PROFESSIONAL
            STANDING ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE
            SERVICE, EXCEEDING [INSERT LIABILITY CAP AMOUNT, E.G., $50 USD OR
            THE AMOUNT PAID BY YOU IN THE PAST 12 MONTHS].
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            7. Governing Law &amp; Contact Information (Placeholder)
          </h2>
          <p>
            These Terms shall be governed by the laws of [Insert Your State /
            Country Jurisdiction]. For questions regarding these Terms, contact:
          </p>
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-sm">
            <p>
              <strong>Business Name:</strong> [Insert Your Business or Legal Name]
            </p>
            <p className="mt-1">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:hello@example.com"
                className="text-blue-600 underline"
              >
                hello@example.com
              </a>{" "}
              <span className="text-slate-500">
                (Placeholder — replace with your actual contact email)
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
