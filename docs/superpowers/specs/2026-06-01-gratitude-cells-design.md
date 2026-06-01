# Gratitude Cells — Design Spec
_2026-06-01_

## Goal

Replace the current flat glass-thin list card in the gratitude section with logo-only glass cells, visually consistent with the work-teaser grid.

## Current State

`index.html` gratitude section has:
1. A `glass-thin gratitude__card` containing `<h2>Thanks to…</h2>` and a `<ul>` of 6 attribution links
2. A `glass gratitude__card` containing the contact/subscribe form

## New Structure

```html
<section class="gratitude">
  <h2 class="work-teaser__heading">Thanks to…</h2>
  <div class="gratitude__grid">
    <!-- 6 × .gratitude-card anchor tags -->
  </div>
  <hr class="fleur" />
  <div class="glass gratitude__card">
    <!-- contact form — unchanged -->
  </div>
</section>
```

## Gratitude Card Anatomy

Each card is an `<a class="glass gratitude-card" href="…" target="_blank" rel="noopener">`:

```
┌─────────────────────┐
│                     │
│    [  logo  ]       │  height: 32px, max-width: 140px, object-fit: contain
│                     │
│  for the typeface   │  font-size: ~0.72em, color: --muted, text-align: center
│                     │
└─────────────────────┘
```

- Glass background, 16px border-radius, same hover lift as `.work-card`
- Padding: `var(--vr-5)` all sides
- No thumbnail, no skill chips

## Layout

`.gratitude__grid`: same CSS grid as `.work-teaser__grid`
- `grid-template-columns: repeat(2, 1fr)`
- `gap: var(--vr-4)`
- `width: 100%`, `max-width: 580px`
- Single column below 480px

## Logos to Source

| Entity | URL | Logo notes |
|---|---|---|
| Recursive | https://www.recursive.design | Wordmark SVG from site |
| Freesound | https://freesound.org | Logo PNG/SVG from site |
| Vercel | https://vercel.com | Black/white SVG — needs light mode variant |
| Claude (Anthropic) | https://anthropic.com | Claude logo SVG — needs light mode variant |
| Suno | https://suno.com | Logo from site |
| Dia | https://diabrowser.com | Logo from site |

Logos saved to `assets/gratitude/`. Dark-mode default; light-mode inverted where needed via `.work-logo--invert-light` or `.work-logo--invert-dark` pattern already in styles.css.

## CSS Changes

Add `.gratitude__grid` and `.gratitude-card` rules to `styles.css`. Reuse `.work-card__logo` sizing. Remove existing `.gratitude__card ul` styles that are no longer needed.

## Links

Same as current HTML — each card links to the same external URL already present in the list items.

## Out of Scope

- Contact form (unchanged)
- Fleur between grid and form (unchanged)
- Interludes on homepage (dropped)
