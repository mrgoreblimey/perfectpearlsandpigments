/**
 * Authenticated encryption for the session cookie payload.
 *
 * We seal the session (which may carry a long-lived refresh token) with
 * AES-256-GCM so the cookie is both tamper-proof and unreadable even if it
 * leaks into a log. Key is derived from AUTH_SESSION_SECRET. Uses only Node's
 * built-in `crypto` — no external dependency.
 *
 * Server-only: this module must never be imported into client code.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const SALT = "ppp-auth-session-v1";

function key(): Buffer {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SESSION_SECRET is missing or too short (need ≥32 chars). Generate with `openssl rand -base64 32`."
    );
  }
  // Derive a stable 32-byte key from the secret.
  return scryptSync(secret, SALT, 32);
}

/** Encrypt a JSON-serialisable payload → compact base64url token. */
export function seal(payload: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  // iv(12) | tag(16) | ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

/** Decrypt a token produced by `seal`. Returns null on any tamper/format error. */
export function unseal<T = unknown>(token: string | undefined): T | null {
  if (!token) return null;
  try {
    const buf = Buffer.from(token, "base64url");
    if (buf.length < 28) return null;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(plaintext.toString("utf8")) as T;
  } catch {
    return null;
  }
}
