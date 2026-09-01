# OMAKASE

Experiencia editorial estática inspirada en el universo visual de OMAKASE de Álvaro Díaz.

## Desarrollo

Requiere Node `>=22.12.0`.

```sh
npm ci
npm run dev
```

## Verificación

```sh
npm run check
npm run build
```

`npm run build` genera el sitio estático en `dist/`.

## Arquitectura

- `src/pages/index.astro` compone la portada.
- `src/pages/sounds/[slug].astro` genera las fichas desde `src/data/tracks.ts`.
- `src/data/tracks.ts` es la fuente de verdad para contenido, rutas y dimensiones de carátulas.
- `src/components/common/LocalImage.astro` normaliza imágenes locales con dimensiones y prioridades de carga explícitas.
- `src/layouts/MainLayout.astro` monta navegación, transiciones y scripts globales.
- `src/scripts/siteMotion.ts` administra Lenis, GSAP, ScrollTrigger e interacciones físicas.
- `src/scripts/pageTransition.ts` maneja la transición pixelada y el selector de canciones.

Los assets locales se sirven desde `public/images/`. Mantener el `transition:name` compartido entre una polaroid y la imagen de su ficha para preservar las transiciones de Astro.
