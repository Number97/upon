# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static link-in-bio website for **Uponground**, an electronic music platform. Single page, no client-side JavaScript.

## Tech Stack

- **Astro** (static site generator) + **Tailwind CSS v4**
- Outputs pure static HTML/CSS to `dist/`
- Deployed on Netlify (config in `netlify.toml`)

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

## Architecture

This is a single-page site. All content lives in `src/pages/index.astro`:
- `socials` array: social media links (Instagram, YouTube, SoundCloud, Bandcamp, Telegram, email)
- `releases` array: music release links

Theme colors defined in `src/styles/global.css` via `@theme` directive:
- `#002366` (blue accent), `#010206` (dark bg), `#BCBEC0` (gray text), `#F2F2F0` (light text)

Font: Inter (loaded from Google Fonts).

## Key Files

- `src/pages/index.astro` — the entire site content and markup
- `src/styles/global.css` — Tailwind import + custom color theme
- `public/logo.svg` — geometric brand logo
- `public/icons.svg` — SVG sprite for social media icons

## Design Direction

Clean, modern, minimal. Appealing to electronic music listeners. Not flashy. Airy spacing, Inter font.
