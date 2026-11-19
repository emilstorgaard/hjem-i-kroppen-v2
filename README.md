# Hjem i Kroppen V2

Marketing website and booking for **Hjem i Kroppen** — dance and movement therapy (danse- og bevægelsesterapi). Built with SvelteKit 2 + Svelte 5, Tailwind CSS v4, content delivered from an Umbraco CMS via its Content Delivery API, and bookings through the [HjemIKroppenBooking](#booking) API.

Live at [hjemikroppen.dk](https://hjemikroppen.dk).

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 with [Svelte](https://svelte.dev) 5 (runes)
- [Tailwind CSS](https://tailwindcss.com) v4 (CSS-first config, no `tailwind.config.js`)
- TypeScript, ESLint + Prettier
- [`@sveltejs/adapter-node`](https://svelte.dev/docs/kit/adapter-node) for production (served as a Node server, containerized with Docker)
- [Umbraco CMS](https://umbraco.com) as a headless content source via the Content Delivery API
- HjemIKroppenBooking (ASP.NET Core .NET 10 Web API) for sessions, series and bookings, called server-side only

## Project structure

```
src/
  app.html              # HTML shell, global head tags, favicons, fonts
  app.d.ts              # App.Locals: token, user, api, correlationId
  hooks.server.ts       # Session cookie → locals (user via GET /me), booking API client per request, security headers
  lib/
    actions/reveal.ts   # Scroll-reveal Svelte action
    api/umbraco.ts      # Client-safe Umbraco helpers (media URLs)
    booking/            # Client-safe booking helpers: category labels/slugs/colours, spots label, form results, toasts, enhance callback, URL helpers
    components/         # Page sections (Header, Hero, About, ...), shared layouts (SplitSection) and SeoHead/StructuredData
      booking/          # Booking UI: Button, Modal (sheet), Toaster, FormField/Field, Alert, Badge, Pagination, ConfirmDialog, SessionCard, SessionSheet, MiniMonth, Login/RegisterForm, PageShell
      admin/            # Admin UI: DataTable, AdminHeader, StatCard, FillBar, UserPicker, Session/SeriesCreateForm
    content/            # Static placeholder content not yet moved to Umbraco (one file per topic)
    navigation.ts       # Header nav links
    server/
      umbraco.ts        # Server-only Umbraco Content Delivery API client (typed, timeout, 404 handling)
      booking-api.ts    # Server-only booking API client (typed, timeout, problem+json → ApiError, X-Correlation-Id, X-Forwarded-For)
      session.ts        # httpOnly session cookies, safe redirect targets
      guards.ts         # requireUser / requireAdmin (UX only; the API authorizes every call)
      actions.ts        # Form action helpers: apiFail (API errors → fail()), readForm, ok
      booking-actions.ts# Book / cancel actions shared by /book and /book/serie/[id]
      admin.ts          # Admin helpers (user search for pickers, paging)
    site.ts             # Shared site-wide constants (SITE_URL)
    therapies.ts        # Slugs of the therapy sub pages (route matcher, home cards, sitemap)
    styles/app.css      # Tailwind entry point + theme tokens + form/chip component classes
    types/              # Types mirroring Umbraco content types/compositions + content item types
      booking/          # Types mirroring the booking API's C# request/response records, one file per area
    utils/media.ts      # Umbraco media URL/srcset helpers
    utils/date.ts       # Europe/Copenhagen date helpers (ISO weeks, DST-safe local ↔ UTC) + date.test.ts
  params/therapy.ts     # Route param matcher: only the known therapy slugs reach [therapy]
  routes/
    +layout.svelte      # Global shell (Header/Footer/Toaster)
    +layout.server.ts   # Loads Umbraco "indstillinger" and "fejlside", passes the signed-in user
    +page.svelte        # Home page, composed of section components
    +page.server.ts     # Loads the Umbraco "forside" content + placeholder content
    priser/             # Prices sub page (placeholder prices from lib/content)
    om-mig/             # About sub page (static copy for now)
    [therapy=therapy]/  # The three therapy pages (/danseterapi, /gruppeterapi, /samtaleterapi) from one route
    book/               # Booking calendar (?uge=2027-W10&kategori=…&ydelse=…&ledige=1&session=…&dag=…)
      serie/[id]/       # Series detail: all sessions, "Book hele forløbet"
    login/ opret-bruger/ logout/   # Auth (full pages, also used inline in the booking sheet)
    min-side/           # The signed-in user's bookings, profile, password, deactivation
    admin/              # Dashboard, sessioner (+[id]), forloeb (+[id]), ydelser, bookinger, brugere (+[id]); role Admin
    +error.svelte       # Error page (403/404/500/503), styled with CMS-driven copy for 404
    sitemap.xml/+server.ts  # Dynamically generated sitemap
static/                 # Favicons, manifest, robots.txt
```

## Prerequisites

- Node.js (current LTS)
- npm
- Docker + Docker Compose (only needed for the containerized build)

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable                 | Description                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_UMBRACO_URL`     | Base URL of the Umbraco instance (Content Delivery API is public, no API key)                                                      |
| `BOOKING_API_URL`        | Base URL of the booking API, without `/api/v1`. Private and read at runtime (`$env/dynamic/private`), e.g. `http://localhost:5014` |
| `DOCKER_BOOKING_API_URL` | Docker only: overrides `BOOKING_API_URL` in `docker-compose.yaml` (default `http://hjem-i-kroppen-booking-api:8080`)               |
| `ORIGIN`                 | Docker only: the public URL (default `https://hjemikroppen.dk`). Required for form actions behind the proxy                        |

> `PUBLIC_UMBRACO_URL` is a `$env/static/public` variable, so it's inlined at **build time**, not read at container start. See the Docker section below. `BOOKING_API_URL` is read at container start.

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
npm test              # unit tests (node --test with type stripping; Node 22.18+)
```

Run `npm run format && npm run lint && npm run check && npm test` before committing.

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
- The compose file expects an external Docker network named `proxy-net` (for a reverse proxy) — create it once with `docker network create proxy-net` if it doesn't already exist. The booking API container (`hjem-i-kroppen-booking-api`) is on the same network, so the frontend reaches it at `http://hjem-i-kroppen-booking-api:8080`.
- `ORIGIN` must be the public URL. Without it SvelteKit sees `http://…` behind the proxy and rejects every form POST (login, booking) with "Cross-site POST form submissions are forbidden".
- `ADDRESS_HEADER=X-Forwarded-For` and `XFF_DEPTH=1` make `getClientAddress()` return the visitor's IP as added by the reverse proxy (see [Rate limiting](#rate-limiting-and-the-proxy)). If there is no reverse proxy in front of the frontend, remove them.

## Booking

### Running against the API locally

1. Start the API as described in its README (`dotnet run --project src/HjemIKroppenBooking.Api`, listens on `http://localhost:5014`, Scalar at `/scalar`).
2. Set `BOOKING_API_URL=http://localhost:5014` in `.env` and run `npm run dev`.
3. Register a user at `/opret-bruger`. To get an admin, promote it in the database (`UPDATE Users SET Role = 'Admin' WHERE Email = '…'`) and log in again; after that, admins can change roles under `/admin/brugere`.

CORS is not involved: the browser only talks to SvelteKit, and SvelteKit calls the API server-to-server.

### Architecture (BFF)

- **The browser never sees the token.** `POST /login` (a form action) calls `POST /api/v1/auth/login` and stores the JWT in the httpOnly, `SameSite=Lax` cookie `hik_session` (`Secure` everywhere except `http://localhost`), with `maxAge` from `expiresAt`. Registration calls `POST /auth/register` and then logs in, and both continue to `?redirectTo=` (same-site paths only).
- **`hooks.server.ts`** reads the cookie and puts `{ token, user, api, correlationId }` on `event.locals`. `user` comes from `GET /me` and is cached for 5 minutes in a second httpOnly cookie (`hik_user`). It is used only for display and routing. The frontend never verifies the JWT, and the API remains the only authority.
- **401 handling:** a 401 on an authenticated API call clears both cookies and redirects to `/login?redirectTo=<current page>`. If `GET /me` returns 401 in the hook (expired, or the user was deactivated), the visitor simply continues signed out. Logout (`POST /logout`) only deletes the cookies, because the API has no revoke endpoint.
- **Reads** happen in `+page.server.ts` loads, and **mutations** go through form actions with `use:enhance`, so every page works without JavaScript. API errors become `fail()` with the API's Danish `detail` and the 422 field `errors` shown next to the matching fields (`src/lib/server/actions.ts`). Generic Danish texts are used only for network failures and 500s.
- **Guards:** `admin/+layout.server.ts` (role `Admin`, otherwise 403) and `min-side/+layout.server.ts` (signed in, otherwise redirect to login). These are for UX only.
- **`booking-api.ts`** sends `X-Correlation-Id` (one per incoming request, so all API calls of a page share it in the API logs) and `X-Forwarded-For`. It times out after 10 s and pages through lists with `pageSize=100` (the API maximum) when a range has more results.
- **Time:** the API uses UTC. Everything is shown in `Europe/Copenhagen` via `Intl.DateTimeFormat('da-DK', { timeZone })`, and `datetime-local` input is converted back to UTC through `zonedToUtc` in `src/lib/utils/date.ts`. That function handles DST through Intl, with no fixed offsets, and is covered by `date.test.ts`.

### The calendar (`/book`)

State lives in the URL: `?uge=2027-W10` (ISO week), `kategori` (therapy slug), `ydelse` (service type id), `ledige=1`, `session` (the open sheet) and `dag` (the selected day on mobile). Back/forward and sharing therefore work, and so does the sheet without JS. After login or registration, the visitor returns to the same URL with the sheet open. `session` and `dag` are read with `untrack`, so opening a session or switching day does not reload the week. The next week is prefetched with `preloadData`.

The therapy pages link to `/book?kategori=<slug>`. A booking option can link to a specific series by setting `seriesId` (`src/lib/types/bookingOption.ts`), which leads to `/book/serie/{id}`.

### Rate limiting and the proxy

The API rate-limits **per client IP** (300/min globally, 10/min for login and register). Because the Node server makes the calls, every visitor would otherwise share the frontend container's IP. Therefore:

- The frontend sends the visitor's IP (`event.getClientAddress()`) as `X-Forwarded-For` on every API call. It never passes on a client-supplied header.
- The API only trusts that header from known proxies. Its `ForwardedHeaders__KnownProxies__0` must be the frontend container's IP, or `ForwardedHeaders__KnownNetworks__0` must contain it. The API's compose file already sets `KnownNetworks` to the `proxy-net` subnet (`TRUSTED_PROXY_NETWORK`), which includes this container. The API uses `ForwardLimit = 1`, so it takes the single value the frontend sends.
- Locally, the frontend calls the API from loopback, which ASP.NET Core trusts by default.
- `AllowedOrigins` (CORS) on the API is irrelevant for these server-to-server calls.

## Content model (Umbraco)

Page content is fetched server-side via `getContentByPath<T>` in [`src/lib/server/umbraco.ts`](src/lib/server/umbraco.ts) (server-only; components never call Umbraco directly), which calls `GET {PUBLIC_UMBRACO_URL}/umbraco/delivery/api/v2/content/item/{path}`. Each Umbraco content type has a matching TypeScript type under `src/lib/types/`:

| Umbraco path    | Content type | Type                                       | Used in                                          |
| --------------- | ------------ | ------------------------------------------ | ------------------------------------------------ |
| `forside`       | Home page    | `HomePage` (`src/lib/types/homePage.ts`)   | `src/routes/+page.server.ts` → `+page.svelte`    |
| `indstillinger` | Settings     | `Settings` (`src/lib/types/settings.ts`)   | `src/routes/+layout.server.ts` → Header/Footer   |
| `fejlside`      | Error 404    | `ErrorPage` (`src/lib/types/errorPage.ts`) | `src/routes/+layout.server.ts` → `+error.svelte` |

All page content types compose `SeoProperties` (`src/lib/types/seo.ts`: `metaTitle`, `metaDescription`, optional `ogImage`), rendered by the shared [`SeoHead.svelte`](src/lib/components/SeoHead.svelte) component (title, description, canonical, Open Graph, Twitter card tags).

## Deployment notes

- Canonical/OG/JSON-LD/sitemap URLs use `SITE_URL` from `src/lib/site.ts` — update it there if the domain ever changes, don't hardcode it elsewhere.
- The sitemap is generated dynamically at `src/routes/sitemap.xml/+server.ts`, not a static file.
