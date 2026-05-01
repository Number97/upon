import type { APIRoute } from 'astro';
import { SESSION_COOKIE, SESSION_MAX_AGE_S, checkPassword, makeSessionCookie } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, url }) => {
  let body: any = {};
  try { body = await request.json(); } catch {}
  const password = String(body?.password || '');
  if (!password || !checkPassword(password)) {
    return new Response(JSON.stringify({ error: 'invalid password' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  cookies.set(SESSION_COOKIE, makeSessionCookie(), {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_S,
  });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
};
