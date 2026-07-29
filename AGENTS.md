# OMAKASE

## Commands

- Requires Node `>=22.12.0`. Use `npm ci` for a clean install.
- `npm run dev` starts Astro's local server; `npm run build` is the production verification and writes the static site to `dist/`.
- There are no lint, test, or type-check scripts. `npm run astro -- check` prompts to install the undeclared `@astrojs/check` dependency.

## Architecture

- This is a static Astro site. `src/pages/index.astro` composes the landing page; `src/pages/sounds/[slug].astro` generates every track page from `src/data/tracks.ts` via `getStaticPaths()`.
- Treat `tracks.ts` as the source of truth for track content and routes. Adding a track requires extending the `Track["slug"]` union and supplying its local image path and gallery data.
- `MainLayout.astro` owns the global stylesheet, `ClientRouter`, navigation, and `siteMotion.ts`. The motion script reinitializes on `astro:page-load`; preserve its cleanup/context pattern for client-side navigation.
- Use `.astro` components for static structure. Add React islands only when browser state or refs are necessary.

## Project Constraints

- Tailwind v4 is configured through `@tailwindcss/vite`; add design tokens in the `@theme` block in `src/styles/global.css`, not a Tailwind config file.
- Local artwork is served from `public/images/`. Do not introduce external image sources by default; retain text placeholders when an image is absent.
- Keep a shared `transition:name` as `track-${track.slug}` on a track polaroid and its detail-page image so Astro view transitions continue to work.
- The fixed `.site-nav` must remain `pointer-events: none`; clickable children opt back in with `pointer-events: auto`.
- Motion must respect `prefers-reduced-motion`. `CustomCursor.tsx` is a React island limited to fine pointers at widths of at least `768px`.

## Design References

- Consult `docs/02_VISUAL_STYLE_GUIDE.md`, `docs/03_ANIMATIONS_AND_INTERACTIONS.md`, and `docs/04_CONTENT_AND_ROUTES.md` before visual, motion, or content changes. The intended result is sparse, physical editorial composition, not a conventional marketing layout.
