import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// Global error handlers so uncaught asynchronous errors are logged without crashing the app
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    console.error("[HumanizeAI Global Error]", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("[HumanizeAI Unhandled Promise Rejection]", event.reason);
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary fallbackTitle="Application Error">
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
