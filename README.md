# Hjem i Kroppen V2

Marketing website for **Hjem i Kroppen** — dance and movement therapy (danse- og bevægelsesterapi). Built with SvelteKit 2 + Svelte 5, Tailwind CSS v4, and content delivered from an Umbraco CMS via its Content Delivery API.

Live at [hjemikroppen.dk](https://hjemikroppen.dk).

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 with [Svelte](https://svelte.dev) 5 (runes)
- [Tailwind CSS](https://tailwindcss.com) v4 (CSS-first config, no `tailwind.config.js`)
- TypeScript, ESLint + Prettier
- [`@sveltejs/adapter-node`](https://svelte.dev/docs/kit/adapter-node) for production (served as a Node server, containerized with Docker)
- [Umbraco CMS](https://umbraco.com) as a headless content source via the Content Delivery API

## Project structure

```
src/
  app.html              # HTML shell, global head tags, favicons, fonts
  lib/
    api/umbraco.ts       # Umbraco Content Delivery API client
    components/          # Page sections (Header, Hero, About, Prices, ...) + SeoHead
    content.ts           # Static placeholder content not yet moved to Umbraco
    site.ts               # Shared site-wide constants (SITE_URL)
    styles/app.css        # Tailwind entry point + theme tokens
    types/                # Types mirroring Umbraco content types/compositions
    utils/media.ts        # Umbraco media URL/srcset helpers
  routes/
    +layout.svelte        # Global shell (Header/Footer, JSON-LD structured data)
    +layout.server.ts     # Loads the Umbraco "Error 404" content for +error.svelte
    +page.svelte           # Home page, composed of section components
    +page.server.ts        # Loads the Umbraco "forside" (home) content
    +error.svelte           # Error page (404/500), styled with CMS-driven copy for 404
    sitemap.xml/+server.ts  # Dynamically generated sitemap
static/                  # Favicons, manifest, robots.txt
```

## Prerequisites

- Node.js (current LTS)
- npm
- Docker + Docker Compose (only needed for the containerized build)

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable             | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `PUBLIC_UMBRACO_URL` | Base URL of the Umbraco instance (Content Delivery API is public, no API key) |

> `PUBLIC_UMBRACO_URL` is a `$env/static/public` variable, so it's inlined at **build time**, not read at container start. See the Docker section below.

## Developing

Install dependencies and start the dev server:

```sh
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The dev server runs on `http://localhost:5173` (falls back to `5174` if busy).

### Other scripts

```sh
npm run build         # production build (outputs to build/)
npm run preview       # preview the production build locally
npm run check         # svelte-kit sync + svelte-check (type/compile errors)
npm run check:watch   # same, in watch mode
npm run lint          # prettier --check . && eslint .
npm run format        # prettier --write .
```

Run `npm run format && npm run lint && npm run check` before committing.

## Building

```sh
npm run build
npm run preview
```

This project uses [`adapter-node`](https://svelte.dev/docs/kit/adapter-node), so the build output in `build/` is a standalone Node server, started with `node build`.

## Running with Docker

```sh
docker compose up --build -d
```

The compose file passes `PUBLIC_UMBRACO_URL` (read from `.env`) as a Docker **build arg**, since SvelteKit bakes `$env/static/public` values in at build time. Because of this:

- Always use `--build` after changing `.env` — `docker compose up` alone reuses the previously built image/layers and won't pick up a new value.
- The compose file expects an external Docker network named `proxy-net` (for a reverse proxy) — create it once with `docker network create proxy-net` if it doesn't already exist.

## Content model (Umbraco)

Page content is fetched server-side via `getContentByPath` in [`src/lib/api/umbraco.ts`](src/lib/api/umbraco.ts), which calls `GET {PUBLIC_UMBRACO_URL}/umbraco/delivery/api/v2/content/item/{path}`. Each Umbraco content type has a matching TypeScript type under `src/lib/types/`:

| Umbraco path | Content type | Type                                       | Used in                                          |
| ------------ | ------------ | ------------------------------------------ | ------------------------------------------------ |
| `forside`    | Home page    | `HomePage` (`src/lib/types/homePage.ts`)   | `src/routes/+page.server.ts` → `+page.svelte`    |
| `fejlside`   | Error 404    | `ErrorPage` (`src/lib/types/errorPage.ts`) | `src/routes/+layout.server.ts` → `+error.svelte` |

All page content types compose `SeoProperties` (`src/lib/types/seo.ts`: `metaTitle`, `metaDescription`, optional `ogImage`), rendered by the shared [`SeoHead.svelte`](src/lib/components/SeoHead.svelte) component (title, description, canonical, Open Graph, Twitter card tags).

## Deployment notes

- Canonical/OG/JSON-LD/sitemap URLs use `SITE_URL` from `src/lib/site.ts` — update it there if the domain ever changes, don't hardcode it elsewhere.
- The sitemap is generated dynamically at `src/routes/sitemap.xml/+server.ts`, not a static file.
