import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';
import { fail, ok, readJson } from '../../../lib/api';
import { DEFAULT_THEME, isHex } from '../../../lib/theme';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  const action = String(body?.action || '');

  if (action === 'reset') {
    await sql`
      update theme set blue = ${DEFAULT_THEME.blue}, dark = ${DEFAULT_THEME.dark},
        gray = ${DEFAULT_THEME.gray}, light = ${DEFAULT_THEME.light}, updated_at = now() where id = 1
    `;
    return ok();
  }

  if (action === 'update') {
    const blue = String(body.blue || '').trim();
    const dark = String(body.dark || '').trim();
    const gray = String(body.gray || '').trim();
    const light = String(body.light || '').trim();
    for (const [k, v] of Object.entries({ blue, dark, gray, light })) {
      if (!isHex(v)) return fail(`${k} must be a 6-digit hex color`);
    }
    await sql`
      update theme set blue = ${blue}, dark = ${dark}, gray = ${gray}, light = ${light}, updated_at = now()
      where id = 1
    `;
    return ok();
  }

  return fail('unknown action');
};
