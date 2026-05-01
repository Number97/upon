import { sql } from './db';
import { DEFAULT_THEME, type Theme } from './theme';

export type Category = {
  id: string;
  slug: string;
  label: string;
  position: number;
};

export type Link = {
  id: string;
  category_id: string;
  title: string;
  url: string;
  position: number;
};

export type Social = {
  id: string;
  name: string;
  url: string;
  icon: string;
  position: number;
};

export type Settings = {
  email: string;
  tagline: string;
};

export type CategoryWithLinks = Category & { links: Link[] };

export type PublicData = {
  categories: CategoryWithLinks[];
  socials: Social[];
  theme: Theme;
  settings: Settings;
};

export async function getCategories(): Promise<Category[]> {
  const rows = await sql`select id, slug, label, position from categories order by position asc, created_at asc`;
  return rows as Category[];
}

export async function getLinks(): Promise<Link[]> {
  const rows = await sql`select id, category_id, title, url, position from links order by category_id, position asc, created_at asc`;
  return rows as Link[];
}

export async function getSocials(): Promise<Social[]> {
  const rows = await sql`select id, name, url, icon, position from socials order by position asc, name asc`;
  return rows as Social[];
}

export async function getTheme(): Promise<Theme> {
  const rows = await sql`select blue, dark, gray, light from theme where id = 1` as any[];
  if (!rows.length) return { ...DEFAULT_THEME };
  return { blue: rows[0].blue, dark: rows[0].dark, gray: rows[0].gray, light: rows[0].light };
}

export async function getSettings(): Promise<Settings> {
  const rows = await sql`select email, tagline from settings where id = 1` as any[];
  if (!rows.length) return { email: 'upongroundhub@gmail.com', tagline: 'Electronic Music Platform' };
  return { email: rows[0].email, tagline: rows[0].tagline };
}

export async function getPublicData(): Promise<PublicData> {
  const [categories, links, socials, theme, settings] = await Promise.all([
    getCategories(),
    getLinks(),
    getSocials(),
    getTheme(),
    getSettings(),
  ]);
  const byCat: Record<string, Link[]> = {};
  for (const link of links) {
    (byCat[link.category_id] ||= []).push(link);
  }
  return {
    categories: categories.map(c => ({ ...c, links: byCat[c.id] || [] })),
    socials,
    theme,
    settings,
  };
}
