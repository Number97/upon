import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';
import { fail, isUrl, ok, readJson } from '../../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  const action = String(body?.action || '');

  if (action === 'create') {
    const category_id = String(body.category_id || '');
    const title = String(body.title || '').trim();
    const url = String(body.url || '').trim();
    if (!category_id) return fail('category_id required');
    if (!title) return fail('title required');
    if (!isUrl(url)) return fail('url is not valid');
    const cat = await sql`select 1 from categories where id = ${category_id}` as any[];
    if (!cat.length) return fail('category not found');
    const maxRow = await sql`select coalesce(max(position), -1) as max from links where category_id = ${category_id}` as any[];
    const position = (maxRow[0]?.max ?? -1) + 1;
    await sql`insert into links (category_id, title, url, position) values (${category_id}, ${title}, ${url}, ${position})`;
    return ok();
  }

  if (action === 'update') {
    const id = String(body.id || '');
    const title = String(body.title || '').trim();
    const url = String(body.url || '').trim();
    if (!id) return fail('id required');
    if (!title) return fail('title required');
    if (!isUrl(url)) return fail('url is not valid');
    await sql`update links set title = ${title}, url = ${url}, updated_at = now() where id = ${id}`;
    return ok();
  }

  if (action === 'delete') {
    const id = String(body.id || '');
    if (!id) return fail('id required');
    await sql`delete from links where id = ${id}`;
    return ok();
  }

  if (action === 'move') {
    const id = String(body.id || '');
    const dir = body.dir === 'up' ? 'up' : body.dir === 'down' ? 'down' : null;
    if (!id || !dir) return fail('id and dir required');
    const meRows = await sql`select id, category_id from links where id = ${id}` as any[];
    if (!meRows.length) return fail('not found');
    const category_id = meRows[0].category_id;
    const all = await sql`select id, position from links where category_id = ${category_id} order by position asc, created_at asc` as any[];
    const idx = all.findIndex((r) => r.id === id);
    if (idx < 0) return fail('not found');
    const swapWith = dir === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= all.length) return ok();
    const a = all[idx];
    const b = all[swapWith];
    await sql`update links set position = ${b.position} where id = ${a.id}`;
    await sql`update links set position = ${a.position} where id = ${b.id}`;
    return ok();
  }

  return fail('unknown action');
};
