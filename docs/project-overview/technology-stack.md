# Tech Stack

## Frontend

### Plain HTML, CSS, and JavaScript (no framework)

We briefly deliberated on using React due to the ability to reuse
components and that once you are familiar with it, it becomes significantly
easier than plain JavaScript, CSS, and HTML, since the JavaScript and HTML
can be in the same file, but given the workload of this semester and that
some of our members hadn't used React before, we decided against it.

All of us are familiar with JavaScript, HTML, and CSS, whether that was
through our COMS modules, or through personal projects, so we saw it as the
best fit given all our experiences. It is more admin and tedious, but it
gives us less technology to have to learn in a semester.

### [MapLibre GL JS](https://maplibre.org/) + CartoDB Voyager vector tiles for the interactive campus map

The campus map uses **MapLibre GL JS v3.6.2** (open-source, loaded via CDN,
no API key) rendering **CartoDB Voyager vector tiles** — live OpenStreetMap
data for the whole world, restyled in code to a Pokémon-GO-style game
palette (green base, muted 3D building extrusion, no street-name/POI
labels). All gameplay information (event stops, proximity circles, the
player avatar) lives on markers layered above the tiles, never in them.
The full architecture is documented in
[`implementation/map-system.md`](../implementation/map-system.md).

#### Why not Google Maps / Street View

An early client meeting (Sprint 1, Meeting 1) requested Google Street View
imagery. We deliberately moved away from the Google stack:

- **Cost & keys:** Google Maps JS + Street View require a *billed* API key
  per deployment with strict free-tier limits — a mid-project billing
  surprise we could not justify for a student project. We briefly tried the
  Google Maps API in Sprint 1 and stopped for exactly this reason.
- **Not stylable:** Street View panoramas and Google raster tiles cannot be
  re-styled into a game palette. Labels, POIs and navigation chrome cannot
  be stripped, so the map "felt like navigation, not a game" (client
  feedback, Sprint 2 Meeting 13).
- **No gameplay value:** challenge attempts gate on GPS proximity (with a
  QR fallback), never on imagery — panoramic photos would add cost without
  adding a mechanic.

MapLibre + CartoDB is keyless, vector-restyleable, and supports the 3D
building extrusion the game look depends on. The client accepted the
game-map direction in Sprint 2. This decision is also recorded in
[`implementation/map-system.md`](../implementation/map-system.md) under
*External API Integration*.

## Backend

### [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) 5

We chose Node.js for the same reasons we chose plain JS, HTML, and CSS for
our frontend. Some of us are experienced with PHP, but that would require
others to either ask for assistance on every difficulty from those already
experienced with it, or contribute work that they themselves would be unable
to both debug and understand.

There is also the fact that it is a tried and tested alternative with a
large amount of documentation and a fairly healthy (as in abundant) library
selection. The syntax is easy to understand given it is JS based and the
errors are typically in the same format, or line. Given we are already
using plain JavaScript, it seemed like the more natural choice for our
backend.

### [MySQL](https://www.mysql.com/) via `mysql2/promise` (local or Aiven-hosted)

We learnt MySQL during our 2nd year for DBF, so most of us would be either
comfortable revisiting it, or are simply already familiar with it enough to
where adjusting would be seamless.

### [Better Auth](https://www.better-auth.com/)

For email/password + Google OAuth.

It is the one that seems recommended the most and is open-source, too, and
works well with Node.js.

## Tooling

### [Jest](https://jestjs.io/)

For frontend and backend unit tests.

We went with Jest due to our familiarity with it from the previous semester's
module Software Design, as most of our members decided to use it for testing
during the semester-long projects for that semester.

It also helps that it is appropriately documented when something is unclear
and that setting it up for running is easy to do in a node-based project.

The only struggle was getting it to support ESM instead of CommonJS.

### [Prettier](https://prettier.io/)

For code formatting.

One of the team members already had familiarity with it and the necessary
configuration files that we could simply copy and paste, so it required
little to no research to add it to the repo.

Prettier is enforced in CI via `.gitea/workflows/format-check.yml`, which
runs `prettier --check .` on every push. This means code cannot be merged
with formatting that disagrees with the project's `.prettierrc.yaml`,
keeping the codebase consistent without relying on individual contributors
to remember to format locally.

### [Taiga](https://taiga.io/)

For task management via Taiga (Kanban).

A team member had experience using it and claimed it was easier to use than
Notion, so we decided to use it. It's simple and provides exactly what we
need, and not much more than that, which suits our needs for it reasonably
well.

It also allows subtasks, which is a plus for when an individual team member
would like to break their task/requirement into more granular tasks for
themselves.

---

## Complete Dependency Reference

Every runtime and development dependency across both `package.json` files,
with its role. Version numbers are the minimum required
range declared in each `package.json`.

### Backend runtime dependencies (`app/src/backend/package.json`)

| Package | Version | Purpose |
| --- | --- | --- |
| [`express`](https://expressjs.com/) | ^5.2.1 | HTTP server framework - routing, middleware, JSON body parsing |
| [`better-auth`](https://www.better-auth.com/) | ^1.7.1 | Authentication library - email/password + Google OAuth. Used instead of hand-rolling auth, per the course brief's requirement to rely on established libraries |
| [`express-session`](https://github.com/expressjs/session) | ^1.19.0 | Session middleware - cookie-based sessions for PIN login, bridged from Better Auth for Google users |
| [`express-mysql-session`](https://github.com/chill117/express-mysql-session) | ^3.0.3 | MySQL-backed session store for `express-session`, so sessions survive server restarts |
| [`mysql2`](https://github.com/sidorares/node-mysql2) | ^3.23.3 | MySQL driver with Promise API - all DB queries use `mysql2/promise` |
| [`cors`](https://github.com/expressjs/cors) | ^2.8.6 | Cross-Origin Resource Sharing middleware - allows the frontend origin (port 8055 during dev) to call the API on port 3000 with credentials |
| [`dotenv`](https://github.com/motdotla/dotenv) | ^17.4.2 | Loads environment variables from `.env` into `process.env` - DB credentials, session secrets, OAuth keys |
| [`ws`](https://github.com/websockets/ws) | ^8.21.3 | WebSocket server - real-time battle match state sync between players |

### Backend dev dependency

| Package | Version | Purpose |
| --- | --- | --- |
| [`esbuild`](https://esbuild.github.io/) | ^0.28.2 | Fast bundler - used in `build.js` to produce a bundled `auth-client.bundle.mjs` for the frontend's Better Auth client |

### Root dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| [`serve`](https://github.com/vercel/serve) | ^14.2.6 | Static file server for the frontend during development (`npm run dev:frontend`) |

### Root dev dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| [`jest`](https://jestjs.io/) | ^29.7.0 | Test runner - configured with two projects (frontend / backend) via `package.json` `jest.projects` |
| [`jest-environment-jsdom`](https://github.com/jsdom/jsdom) | ^29.7.0 | jsdom test environment for frontend tests (mocks `document`, `window`, `navigator`) |
| [`prettier`](https://prettier.io/) | ^3.9.6 | Code formatter - enforced in CI via `format:check` |
| [`vite`](https://vitejs.dev/) | ^8.2.2 | Frontend dev server with HMR - optional; the backend can serve the frontend directly on port 3000 |

### External services (not npm packages, but third-party code the project depends on)

| Service / library                                           | Purpose                                                                                 |
| ---                                                         | ---                                                                                     |
| [CartoDB Voyager vector tiles](https://carto.com/basemaps)  | Basemap tiles (live worldwide OSM data) for the campus map, restyled client-side into the game palette. Loaded from Carto's basemaps CDN, no API key |
| [MapLibre GL JS](https://maplibre.org/)                     | Client-side WebGL map rendering - loaded via CDN, no API key (replaced Leaflet/OSM raster tiles in Sprint 2; see map decision above) |
| [Aiven](https://aiven.io/)                                  | Managed MySQL hosting for the shared development database (alternative to local Docker) |
| [GitHub Pages](https://pages.github.com/)                   | Hosting for this documentation site                                                     |
| [Cloudflare Workers static hosting](https://workers.cloudflare.com/) | Hosting for the deployed frontend via `wrangler deploy --assets` (`frontend-deploy.yml`) → `https://website.adamas2aurum.workers.dev` |
