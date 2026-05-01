import type { APIRoute } from 'astro';
import { getPublicData } from '../../lib/queries';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await getPublicData();
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'failed to load data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
