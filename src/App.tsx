/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { FaqPage } from "./pages/FaqPage";
import { HomePage } from "./pages/HomePage";
import { HumanizerPage } from "./pages/HumanizerPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { PageRoute, WritingStyle } from "./types/humanizer";
import { updatePageSeo } from "./utils/textMetrics";

function resolveRouteFromLocation(): PageRoute {
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, "");

  const validRoutes: PageRoute[] = [
    "home",
    "humanizer",
    "about",
    "faq",
    "privacy",
    "terms",
  ];

  if (validRoutes.includes(path as PageRoute)) {
    return path as PageRoute;
  }
  if (validRoutes.includes(hash as PageRoute)) {
    return hash as PageRoute;
  }
  return "home";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(() =>
    resolveRouteFromLocation()
  );
  const [prefilledText, setPrefilledText] = useState<string>("");
  const [prefilledStyle, setPrefilledStyle] = useState<
    WritingStyle | undefined
  >(undefined);

  useEffect(() => {
    updatePageSeo(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(resolveRouteFromLocation());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (page: PageRoute, sectionId?: string) => {
    setCurrentPage(page);

    try {
      const targetUrl = page === "home" ? "/" : `/${page}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page }, "", targetUrl);
      }
    } catch {
      // Fallback if history pushState is restricted
    }

    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenSampleInTool = (sampleText: string, style?: WritingStyle) => {
    setPrefilledText(sampleText);
    if (style) {
      setPrefilledStyle(style);
    }
    handleNavigate("humanizer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        <ErrorBoundary key={currentPage} fallbackTitle="Page Error">
          {currentPage === "home" && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenSampleInTool={handleOpenSampleInTool}
            />
          )}
          {currentPage === "humanizer" && (
            <HumanizerPage
              initialText={prefilledText}
              initialStyle={prefilledStyle}
            />
          )}
          {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
          {currentPage === "faq" && <FaqPage onNavigate={handleNavigate} />}
          {currentPage === "privacy" && <PrivacyPage />}
          {currentPage === "terms" && <TermsPage />}
        </ErrorBoundary>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
