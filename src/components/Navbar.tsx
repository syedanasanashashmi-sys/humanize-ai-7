import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { PageRoute } from "../types/humanizer";

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageRoute, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("home");
          }}
          className="text-xl font-bold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded"
        >
          HumanizeAI
        </a>

        {/* Zone 2: Primary Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("home");
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              currentPage === "home"
                ? "text-slate-900 border-blue-600 font-semibold"
                : "border-transparent hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            Home
          </a>
          <a
            href="#humanizer"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("humanizer");
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              currentPage === "humanizer"
                ? "text-slate-900 border-blue-600 font-semibold"
                : "border-transparent hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            Humanizer
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("home", "how-it-works");
            }}
            className="py-1 transition-colors whitespace-nowrap border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("faq");
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              currentPage === "faq"
                ? "text-slate-900 border-blue-600 font-semibold"
                : "border-transparent hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            FAQ
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("about");
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              currentPage === "about"
                ? "text-slate-900 border-blue-600 font-semibold"
                : "border-transparent hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            About
          </a>
        </nav>

        {/* Zone 3: Primary Action & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick("humanizer")}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
          >
            ✨ Humanize Text
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg"
        >
          <button
            type="button"
            onClick={() => handleNavClick("home")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
              currentPage === "home"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("humanizer")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
              currentPage === "humanizer"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Humanizer
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("home", "how-it-works")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("faq")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
              currentPage === "faq"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("about")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
              currentPage === "about"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            About
          </button>

          <div className="pt-3 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleNavClick("humanizer")}
              className="w-full py-3 px-4 text-center text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              Humanize Text
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
