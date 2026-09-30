import type { NextFunction, Request, Response } from "express";

/**
 * Server-side reCAPTCHA v3 verification for the public write endpoints.
 *
 * The browser already loads reCAPTCHA for Firebase App Check, but App Check is
 * enforced by Firebase — it never gates our own Express routes. This module is
 * what actually stops scripted abuse of /api/register and /api/contact.
 *
 * Behaviour:
 *  - RECAPTCHA_SECRET_KEY set      -> token required and verified against Google.
 *  - RECAPTCHA_SECRET_KEY unset    -> verification is skipped (local/dev), and a
 *                                     warning is logged once so the gap is visible.
 */

let warned = false;

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export interface CaptchaResult {
  ok: boolean;
  /** Normalised, non-enumerating reason for logs. */
  reason?: "missing" | "invalid" | "low_score" | "network";
}

export function isCaptchaConfigured(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export async function verifyCaptcha(
  token: unknown,
  remoteIp: string | undefined,
  minScore = 0.5
): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (!warned) {
      warned = true;
      console.warn(
        "[captcha] RECAPTCHA_SECRET_KEY is not set — public write endpoints are not CAPTCHA-protected."
      );
    }
    return { ok: true };
  }

  if (typeof token !== "string" || !token.trim()) return { ok: false, reason: "missing" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return { ok: false, reason: "network" };

    const data = (await res.json()) as { success?: boolean; score?: number };
    if (!data.success) return { ok: false, reason: "invalid" };
    if (typeof data.score === "number" && data.score < minScore) {
      return { ok: false, reason: "low_score" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[captcha] verification unreachable:", (error as Error)?.message);
    return { ok: false, reason: "network" };
  }
}

/**
 * Middleware factory. Body must already be parsed (express.json runs first).
 * Returns 403 on failure — the client shows a generic "please try again".
 */
export function requireCaptcha(minScore = 0.5) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await verifyCaptcha((req.body as { recaptchaToken?: unknown })?.recaptchaToken, req.ip, minScore);
    if (!result.ok) {
      console.warn("[captcha] rejected request:", result.reason);
      res.status(403).json({
        success: false,
        error: "We could not verify this submission. Please refresh the page and try again.",
      });
      return;
    }
    next();
  };
}
