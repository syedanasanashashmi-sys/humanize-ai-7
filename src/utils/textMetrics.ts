import { PageRoute } from "../types/humanizer";

/**
 * Counts the number of words in a string accurately as the user types.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Counts the number of characters in a string.
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Triggers a browser file download of the given text as a plain .txt file.
 */
export function downloadTextFile(
  content: string,
  filename = "humanized-text.txt"
): void {
  if (!content) return;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies text to the clipboard with a fallback for restricted iframe contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to textarea fallback
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
  } catch {
    return false;
  }
}

/**
 * Updates document title and meta description dynamically for each page route.
 */
export function updatePageSeo(page: PageRoute): void {
  const seoMap: Record<
    PageRoute,
    { title: string; description: string }
  > = {
    home: {
      title: "HumanizeAI - Make AI-Assisted Writing Sound More Natural",
      description:
        "Improve the clarity, flow, tone, and readability of AI-assisted writing with HumanizeAI.",
    },
    humanizer: {
      title: "AI Text Humanizer Tool — Improve Clarity & Flow | HumanizeAI",
      description:
        "Paste your AI-assisted draft and transform it into natural, clear, and readable writing in Natural, Professional, Casual, Academic, Friendly, or Concise styles.",
    },
    about: {
      title: "About HumanizeAI — Editorial Quality for AI-Assisted Writing",
      description:
        "Learn how HumanizeAI helps writers, professionals, and students refine AI-assisted drafts into clear, natural prose while preserving original meaning.",
    },
    faq: {
      title: "Frequently Asked Questions (FAQ) | HumanizeAI",
      description:
        "Find honest answers about how HumanizeAI works, supported writing styles, usage limits, privacy practices, and AI detector expectations.",
    },
    privacy: {
      title: "Privacy Policy | HumanizeAI",
      description:
        "Read the HumanizeAI Privacy Policy to learn how submitted text is processed, what information is collected, and how your privacy is protected.",
    },
    terms: {
      title: "Terms of Service | HumanizeAI",
      description:
        "Review the Terms of Service for using the HumanizeAI writing improvement web application.",
    },
  };

  const current = seoMap[page] || seoMap.home;
  document.title = current.title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", current.description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", current.title);
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  if (ogDescription) {
    ogDescription.setAttribute("content", current.description);
  }
}
