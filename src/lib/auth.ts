import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
export const SESSION_COOKIE = 'upg_admin';

function getSecret(): string {
  const s = import.meta.env.ADMIN_SECRET || process.env.ADMIN_SECRET;
  if (!s) throw new Error('ADMIN_SECRET is not set');
  return s;
}

function getPassword(): string {
  const p = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!p) throw new Error('ADMIN_PASSWORD is not set');
  return p;
}

export function checkPassword(input: string): boolean {
  const expected = Buffer.from(getPassword());
  const got = Buffer.from(input);
  if (got.length !== expected.length) return false;
  return timingSafeEqual(got, expected);
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function makeSessionCookie(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionCookie(cookie: string | undefined): boolean {
  if (!cookie) return false;
  const idx = cookie.indexOf('.');
  if (idx === -1) return false;
  const payload = cookie.slice(0, idx);
  const sig = cookie.slice(idx + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return false;
  return Date.now() < expiresAt;
}

export const SESSION_MAX_AGE_S = Math.floor(SESSION_DURATION_MS / 1000);
