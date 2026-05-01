export const DEFAULT_THEME = {
  blue:  '#002366',
  dark:  '#010206',
  gray:  '#BCBEC0',
  light: '#F2F2F0',
} as const;

export type Theme = typeof DEFAULT_THEME;

export function themeToCssVars(theme: Theme): string {
  return `:root{--color-blue:${theme.blue};--color-dark:${theme.dark};--color-gray:${theme.gray};--color-light:${theme.light};}`;
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
export function isHex(value: string): boolean {
  return HEX_RE.test(value);
}
