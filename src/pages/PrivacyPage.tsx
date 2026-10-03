import React from "react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last Updated: October 2026 · Template Notice: Please review and
          replace bracketed placeholders with your actual business details
          before commercial launch.
        </p>
      </header>

      <div className="mt-8 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            1. Overview
          </h2>
          <p>
            This Privacy Policy explains how <strong>HumanizeAI</strong>{" "}
            ("[Your Company/Business Name]", "we", "us", or "our") handles
            information when you use our website and text humanization tool.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Submitted Text:</strong> The text you paste or type into
              the Humanizer Tool, along with your selected writing style,
              intensity, and language preferences.
            </li>
            <li>
              <strong>Usage &amp; Rate-Limit Data:</strong> To enforce our daily
              free usage limit (5 requests per day), our server temporarily
              records request counts associated with your IP address and an
              anonymous browser session identifier in server memory.
            </li>
            <li>
              <strong>Standard Server Logs:</strong> Like most web applications,
              our hosting environment may process standard HTTP request metadata
              (such as IP address, browser user-agent, request timestamp, and
              status codes) for operational reliability and security.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            3. How Submitted Text Is Processed &amp; Whether It Is Stored
          </h2>
          <p>
            When you click "Humanize Text", your submitted text is sent over an
            HTTP request to our backend server. Our server validates the text
            and forwards it to the Google Gemini API to generate the rewritten
            output, then returns the result to your browser.
          </p>
          <p>
            <strong>Permanent Storage:</strong> HumanizeAI does{" "}
            <strong>not</strong> use a database to permanently store, archive,
            or log your submitted text or rewritten output on our servers. Once
            the response is returned to your browser, our application server
            discards the text from memory.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            4. Use of Third-Party AI Services
          </h2>
          <p>
            We use the <strong>Google Gemini API</strong> to process and rewrite
            the text you submit. Your submitted text is transmitted to Google's
            API servers in order to fulfill your request. Google's processing of
            API data is governed by the applicable Google APIs Terms of Service
            and Gemini API data usage policies (which may vary depending on
            whether the site operator uses a free-tier or paid-tier Google Cloud
            billing account). Please avoid submitting confidential, sensitive
            personal, medical, or financial information into the tool.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            5. Cookies, Session Storage &amp; Analytics
          </h2>
          <p>
            HumanizeAI uses browser <code className="font-mono">sessionStorage</code>{" "}
            to store a random, anonymous session identifier (
            <code className="font-mono">humanizeai_session_id</code>) solely to
            keep track of your remaining daily free uses during your browsing
            session. We do not use third-party advertising cookies or tracking
            pixels by default. If you add third-party analytics tools in the
            future, update this section to disclose them.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            6. Your Rights &amp; Choices
          </h2>
          <p>
            Because we do not require user accounts or permanently store your
            submitted text in an application database, there is no stored profile
            or text history tied to your identity on our servers. You can clear
            your browser's session storage at any time through your browser
            settings. Depending on your jurisdiction (such as the EU/EEA, UK, or
            California), you may have additional legal rights regarding personal
            data; you can contact us using the details below with any questions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            7. Contact Information (Placeholder)
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact:
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
            <p className="mt-1">
              <strong>Address:</strong> [Insert Your Business Mailing Address]
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
