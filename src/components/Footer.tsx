import React from "react";
import { PageRoute } from "../types/humanizer";

interface FooterProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
          {/* Brand & Tagline */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
            >
              HumanizeAI
            </button>
            <p className="text-sm text-slate-600">
              AI-assisted writing, improved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate("humanizer")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Humanizer
            </button>
            <button
              type="button"
              onClick={() => onNavigate("about")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => onNavigate("faq")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => onNavigate("privacy")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate("terms")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => onNavigate("home", "contact")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} HumanizeAI. All rights reserved.</p>
          <p>
            Contact:{" "}
            <a
              href="mailto:hello@example.com"
              className="text-slate-700 hover:text-blue-600 underline underline-offset-2"
            >
              hello@example.com
            </a>{" "}
            <span className="text-slate-400">
              (Placeholder — replace with your actual contact email)
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
