import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';
import { fail, ok, readJson } from '../../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  const email = String(body.email || '').trim();
  const tagline = String(body.tagline || '').trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return fail('email is not valid');
  if (!tagline) return fail('tagline required');
  await sql`update settings set email = ${email}, tagline = ${tagline} where id = 1`;
  return ok();
};
