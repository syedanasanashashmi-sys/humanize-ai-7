# HumanizeAI — Full-Stack Web Application Setup & Guide

**HumanizeAI** is a full-stack web application that transforms AI-assisted writing into natural, clear, readable, and engaging prose while preserving the original meaning and facts.

---

## 1. Where to Obtain a Gemini API Key

1. Visit **Google AI Studio** at [https://aistudio.google.com/](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** in the left navigation bar and click **Create API key**.
4. Copy your generated API key and keep it private.

---

## 2. Where to Put the API Key & Environment Variable Name

The application reads your API key exclusively on the backend server using the environment variable name:

```text
GEMINI_API_KEY
```

### In Google AI Studio Build Mode:
- Open the **Settings > Secrets** panel in the AI Studio interface.
- Make sure `GEMINI_API_KEY` is added there. AI Studio automatically injects it into the backend server at runtime.

### When Running Locally on Your Computer:
1. In the root folder of the project, copy the `.env.example` file and rename the copy to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in any text editor and replace `MY_GEMINI_API_KEY` with your real Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```
3. **Important Security Rule:** Never put `GEMINI_API_KEY` inside React components (`src/`), HTML files, or browser-exposed `VITE_` variables, and never commit your `.env` file to Git.

---

## 3. How to Run the Application Locally

Make sure you have **Node.js (v18 or newer)** installed on your computer.

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the full-stack development server (Frontend + Backend on port 3000):**
   ```bash
   npm run dev
   ```
3. **Open in your browser:**
   Visit `http://localhost:3000`

---

## 4. How to Change Free Usage Limits

All limits are stored in a single, easy-to-edit file: **`server/config.ts`** (or you can set them in your `.env` file without touching code).

| Setting | Environment Variable | Default Value | Description |
| :--- | :--- | :--- | :--- |
| Daily Free Requests | `DAILY_FREE_LIMIT` | `5` | Number of free humanization requests per day per user/IP/session |
| Maximum Words | `MAX_INPUT_WORDS` | `1000` | Maximum words allowed per request |
| Maximum Characters | `MAX_INPUT_CHARACTERS` | `6000` | Maximum characters allowed per request |

To change these values:
- Either update `DAILY_FREE_LIMIT`, `MAX_INPUT_WORDS`, or `MAX_INPUT_CHARACTERS` in your `.env` file, **or**
- Open `server/config.ts` and change the default numbers inside `APP_CONFIG`.

---

## 5. How to Change the Gemini Model

By default, HumanizeAI uses `gemini-3.8-flash`.

To change the model:
- Set the `GEMINI_MODEL` environment variable in your `.env` file or hosting platform secrets:
  ```env
  GEMINI_MODEL="gemini-3.8-flash"
  ```
- Or edit `GEMINI_MODEL` directly inside `server/config.ts`.

---

## 6. How to Deploy to Production

1. **Build the frontend bundle:**
   ```bash
   npm run build
   ```
2. **Start the production server:**
   ```bash
   npm start
   ```
   *(This runs `NODE_ENV=production tsx server.ts`, which serves both the compiled React frontend from `dist/` and the backend `/api/humanize` and `/api/usage` endpoints on port 3000).*
3. **Cloud Hosting (Google Cloud Run, Render, Railway, Fly.io):**
   - Set `GEMINI_API_KEY` in your hosting provider's Environment Variables / Secrets panel.
   - Set the build command to `npm run build`.
   - Set the start command to `npm start`.

---

## 7. Project File Structure

### Frontend Files (`/src`)
- `index.html` — Main HTML entry point, SEO meta tags, Open Graph tags, and Schema.org JSON-LD.
- `src/main.tsx` — React application mount point.
- `src/App.tsx` — Page router connecting Home, Humanizer, About, FAQ, Privacy Policy, and Terms.
- `src/components/Navbar.tsx` — Responsive top navigation bar and mobile menu.
- `src/components/Footer.tsx` — Footer with navigation links and contact placeholder.
- `src/pages/HomePage.tsx` — SaaS homepage with Hero, interactive tool preview, Features, How It Works, FAQ preview, Contact, and CTA.
- `src/pages/HumanizerPage.tsx` — Core two-panel Humanizer Tool with style/intensity controls, word/character counters, Copy, Download `.txt`, and Clear actions.
- `src/pages/AboutPage.tsx` — About page with editorial mission and transparency statement.
- `src/pages/FaqPage.tsx` — Complete FAQ page with all 9 questions and honest answers.
- `src/pages/PrivacyPage.tsx` — Privacy Policy template.
- `src/pages/TermsPage.tsx` — Terms of Service template.
- `src/services/api.ts` — Frontend API client calling `/api/humanize` and `/api/usage`.
- `src/types/humanizer.ts` — Shared TypeScript interfaces, style options, and sample text.
- `src/utils/textMetrics.ts` — Live word/character counter, clipboard copy, `.txt` download, and SEO title updater.

### Backend Files (`/server` & `server.ts`)
- `server.ts` — Express server entry point handling `/api/humanize` and `/api/usage` and serving the frontend.
- `server/config.ts` — Central configuration for daily free limits, maximum word/character limits, timeout, and Gemini model name.
- `server/geminiService.ts` — Secure server-side `@google/genai` integration and humanization prompt builder.
- `server/validation.ts` — Server-side input sanitization, word/character limit validation, and error messages.
- `server/rateLimiter.ts` — Server-side daily free usage rate limiter with modular hooks for future database and user authentication integration.
