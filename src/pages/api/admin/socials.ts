import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';
import { fail, isUrl, ok, readJson } from '../../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  const action = String(body?.action || '');

  if (action === 'create') {
    const name = String(body.name || '').trim();
    const url = String(body.url || '').trim();
    const icon = String(body.icon || '').trim();
    if (!name) return fail('name required');
    if (!isUrl(url)) return fail('url is not valid');
    if (!icon) return fail('icon required');
    const dup = await sql`select 1 from socials where name = ${name}` as any[];
    if (dup.length) return fail('name already exists');
    const maxRow = await sql`select coalesce(max(position), -1) as max from socials` as any[];
    const position = (maxRow[0]?.max ?? -1) + 1;
    await sql`insert into socials (name, url, icon, position) values (${name}, ${url}, ${icon}, ${position})`;
    return ok();
  }

  if (action === 'update') {
    const id = String(body.id || '');
    const name = String(body.name || '').trim();
    const url = String(body.url || '').trim();
    const icon = String(body.icon || '').trim();
    if (!id) return fail('id required');
    if (!name) return fail('name required');
    if (!isUrl(url)) return fail('url is not valid');
    if (!icon) return fail('icon required');
    const dup = await sql`select 1 from socials where name = ${name} and id <> ${id}` as any[];
    if (dup.length) return fail('name already exists');
    await sql`update socials set name = ${name}, url = ${url}, icon = ${icon} where id = ${id}`;
    return ok();
  }

  if (action === 'delete') {
    const id = String(body.id || '');
    if (!id) return fail('id required');
    await sql`delete from socials where id = ${id}`;
    return ok();
  }

  if (action === 'move') {
    const id = String(body.id || '');
    const dir = body.dir === 'up' ? 'up' : body.dir === 'down' ? 'down' : null;
    if (!id || !dir) return fail('id and dir required');
    const all = await sql`select id, position from socials order by position asc, name asc` as any[];
    const idx = all.findIndex((r) => r.id === id);
    if (idx < 0) return fail('not found');
    const swapWith = dir === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= all.length) return ok();
    const a = all[idx];
    const b = all[swapWith];
    await sql`update socials set position = ${b.position} where id = ${a.id}`;
    await sql`update socials set position = ${a.position} where id = ${b.id}`;
    return ok();
  }

  return fail('unknown action');
};
