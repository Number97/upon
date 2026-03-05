# Uponground

Link-in-bio website for **Uponground**, an electronic music platform. Built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com).

Outputs a single static HTML page — no JavaScript shipped to the browser.

## Local Development Setup (macOS)

### 1. Install Node.js via nvm

Node.js uses `node_modules/` for per-project dependency isolation (no virtual environment needed like Python). Use **nvm** to manage Node versions:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Restart your terminal, then:
nvm install --lts
nvm use --lts

# Verify
node --version   # should show v22.x or similar
npm --version    # should show v10.x or similar
```

### 2. Install dependencies

```bash
cd upon
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:4321`. Changes auto-reload.

### 4. Build for production

```bash
npm run build
```

Static output goes to `dist/`.

### 5. Preview the production build

```bash
npm run preview
```

## Deploying to Netlify

### Option A: Connect your GitHub repo (recommended)

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) and sign up / log in
3. Click **"Add new site"** > **"Import an existing project"**
4. Select your GitHub repo
5. Netlify auto-detects the settings from `netlify.toml` — just click **Deploy**
6. Your site will be live at a `*.netlify.app` URL. You can add a custom domain in Site Settings > Domain Management

### Option B: Manual deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Follow the prompts to link or create a new site.

## Project Structure

```
public/
  logo.svg        # Uponground geometric logo (vector)
  icons.svg       # Social media icon sprite
  palette.jpeg    # Brand color reference (not used in site)
src/
  pages/
    index.astro   # The single page
  styles/
    global.css    # Tailwind config + custom theme colors
astro.config.mjs  # Astro + Tailwind vite plugin
netlify.toml      # Netlify build config
```

## Brand Colors

| Color   | Hex       | Usage                  |
|---------|-----------|------------------------|
| Blue    | `#002366` | Accent / hover states  |
| Dark    | `#010206` | Background             |
| Gray    | `#BCBEC0` | Secondary text / icons |
| Light   | `#F2F2F0` | Primary text           |

## Editing Content

All links and content are in [src/pages/index.astro](src/pages/index.astro) — edit the `socials` and `releases` arrays at the top of the file.
