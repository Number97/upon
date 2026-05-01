export function ok(data: any = { ok: true }) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
  });
}

export function fail(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function readJson(request: Request): Promise<any> {
  try { return await request.json(); } catch { return {}; }
}

export function isUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9-]+$/.test(value);
}
