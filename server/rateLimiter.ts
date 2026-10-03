import type { Request } from "express";
import { APP_CONFIG } from "./config.ts";

/**
 * ============================================================================
 * RATE LIMITING & FUTURE DATABASE / AUTH ARCHITECTURE
 * ============================================================================
 *
 * IMPORTANT NOTE FOR PRODUCTION:
 * This MVP uses a temporary server-side in-memory store to enforce the daily
 * free usage limit (default: 5 requests per day per client IP/session).
 * Because in-memory state resets whenever the server restarts and is not shared
 * across multiple server instances, you can later replace `InMemoryUsageStore`
 * with a database-backed implementation using the `UsageStore` interface below.
 *
 * TODO (Future Database & Authentication Integration):
 * 1. Authentication:
 *    - Verify a session cookie or Bearer token in `resolveClientIdentifier(req)`
 *      to identify authenticated users by `user.id` instead of IP address.
 * 2. Database Tables / Collections to add when scaling:
 *    - `users`: { id, email, createdAt, role }
 *    - `subscriptions`: { userId, planTier, dailyLimit, maxWordsPerRequest, status }
 *    - `usage`: { identifier, dateKey, requestCount, wordsProcessed, updatedAt }
 *    - `humanization_history`: (Opt-in only) { id, userId, style, intensity, createdAt }
 *    - `settings`: { userId, defaultStyle, defaultIntensity, storeHistoryOptIn }
 */

export interface RateLimitStatus {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
}

interface UsageRecord {
  count: number;
  dateKey: string; // YYYY-MM-DD in UTC
}

/**
 * Modular interface so a database (PostgreSQL, Firestore, Redis) can be
 * swapped in later without changing route logic.
 */
export interface UsageStore {
  getStatus(identifier: string): Promise<RateLimitStatus>;
  consume(identifier: string): Promise<RateLimitStatus>;
  reset(identifier: string): Promise<RateLimitStatus>;
}

function getCurrentUtcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getNextUtcMidnightIso(): string {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
  );
  return tomorrow.toISOString();
}

class InMemoryUsageStore implements UsageStore {
  private records = new Map<string, UsageRecord>();

  private cleanupOldRecords(todayKey: string) {
    // Prevent unbounded memory growth by purging stale date keys
    if (this.records.size > 5000) {
      for (const [key, record] of this.records.entries()) {
        if (record.dateKey !== todayKey) {
          this.records.delete(key);
        }
      }
    }
  }

  async getStatus(identifier: string): Promise<RateLimitStatus> {
    const todayKey = getCurrentUtcDateKey();
    this.cleanupOldRecords(todayKey);

    const limit = APP_CONFIG.DAILY_REQUEST_LIMIT;
    const existing = this.records.get(identifier);

    const used =
      existing && existing.dateKey === todayKey ? existing.count : 0;
    const remaining = Math.max(0, limit - used);

    return {
      allowed: used < limit,
      limit,
      used,
      remaining,
      resetAt: getNextUtcMidnightIso(),
    };
  }

  async consume(identifier: string): Promise<RateLimitStatus> {
    const todayKey = getCurrentUtcDateKey();
    const limit = APP_CONFIG.DAILY_REQUEST_LIMIT;
    const existing = this.records.get(identifier);

    let currentCount =
      existing && existing.dateKey === todayKey ? existing.count : 0;

    if (currentCount >= limit) {
      return {
        allowed: false,
        limit,
        used: currentCount,
        remaining: 0,
        resetAt: getNextUtcMidnightIso(),
      };
    }

    currentCount += 1;
    this.records.set(identifier, {
      count: currentCount,
      dateKey: todayKey,
    });

    return {
      allowed: true,
      limit,
      used: currentCount,
      remaining: Math.max(0, limit - currentCount),
      resetAt: getNextUtcMidnightIso(),
    };
  }

  async reset(identifier: string): Promise<RateLimitStatus> {
    this.records.delete(identifier);
    const limit = APP_CONFIG.DAILY_REQUEST_LIMIT;
    return {
      allowed: true,
      limit,
      used: 0,
      remaining: limit,
      resetAt: getNextUtcMidnightIso(),
    };
  }
}

export const usageStore: UsageStore = new InMemoryUsageStore();

/**
 * Resolves a unique client identifier for rate limiting.
 *
 * TODO (Auth Integration):
 * When authentication is enabled, check `req.user?.id` first so logged-in
 * users have their quota tracked per account across devices.
 */
export function resolveClientIdentifier(req: Request): string {
  // Combine IP address with an optional anonymous client session header
  // so multiple users or sessions are accurately tracked.
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.ip || req.socket.remoteAddress || "unknown-ip";

  const clientSessionId =
    typeof req.headers["x-client-session"] === "string"
      ? req.headers["x-client-session"].slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, "")
      : "";

  return clientSessionId ? `${ip}:${clientSessionId}` : ip;
}
