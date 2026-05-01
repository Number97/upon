import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, verifySessionCookie } from './lib/auth';

const PUBLIC_ADMIN_PATHS = new Set([
  '/admin/login',
  '/api/admin/login',
]);

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  if (!isAdminPage && !isAdminApi) return next();
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return next();

  const cookie = ctx.cookies.get(SESSION_COOKIE)?.value;
  const ok = verifySessionCookie(cookie);
  if (ok) return next();

  if (isAdminApi) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return ctx.redirect('/admin/login');
});
