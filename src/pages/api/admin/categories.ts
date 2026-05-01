import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';
import { fail, isSlug, ok, readJson } from '../../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  const action = String(body?.action || '');

  if (action === 'create') {
    const label = String(body.label || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!label) return fail('label required');
    if (!isSlug(slug)) return fail('slug must be lowercase letters, numbers, hyphens');
    const existing = await sql`select 1 from categories where slug = ${slug}` as any[];
    if (existing.length) return fail('slug already exists');
    const maxRow = await sql`select coalesce(max(position), -1) as max from categories` as any[];
    const position = (maxRow[0]?.max ?? -1) + 1;
    await sql`insert into categories (slug, label, position) values (${slug}, ${label}, ${position})`;
    return ok();
  }

  if (action === 'update') {
    const id = String(body.id || '');
    const label = String(body.label || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!id) return fail('id required');
    if (!label) return fail('label required');
    if (!isSlug(slug)) return fail('slug must be lowercase letters, numbers, hyphens');
    const dup = await sql`select 1 from categories where slug = ${slug} and id <> ${id}` as any[];
    if (dup.length) return fail('slug already exists');
    await sql`update categories set label = ${label}, slug = ${slug} where id = ${id}`;
    return ok();
  }

  if (action === 'delete') {
    const id = String(body.id || '');
    if (!id) return fail('id required');
    await sql`delete from categories where id = ${id}`;
    return ok();
  }

  if (action === 'move') {
    const id = String(body.id || '');
    const dir = body.dir === 'up' ? 'up' : body.dir === 'down' ? 'down' : null;
    if (!id || !dir) return fail('id and dir required');
    const all = await sql`select id, position from categories order by position asc, created_at asc` as any[];
    const idx = all.findIndex((r) => r.id === id);
    if (idx < 0) return fail('not found');
    const swapWith = dir === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= all.length) return ok();
    const a = all[idx];
    const b = all[swapWith];
    await sql`update categories set position = ${b.position} where id = ${a.id}`;
    await sql`update categories set position = ${a.position} where id = ${b.id}`;
    return ok();
  }

  return fail('unknown action');
};
