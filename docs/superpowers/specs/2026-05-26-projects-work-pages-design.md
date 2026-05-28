# Design Spec: Projects Page, Work Page, Homepage Updates

**Date:** 2026-05-26
**Status:** Approved

---

## Overview

Add `/projects` and `/work` as standalone static HTML pages. Truncate the homepage constellation to 4 featured projects and add a 4-card work teaser after it. Update email form copy. All pages share `styles.css` and `main.js`, no build step introduced.

---

## 1. Architecture

- Three static HTML files: `index.html` (updated), `projects.html` (new), `work.html` (new)
- All share `./styles.css` and `./main.js` via relative paths
- Navigation is scroll-based; name (`Kerry Alan Snyder`) links to `/` on all pages
- No hero marquee on sub-pages — the name is the only shared header element

---

## 2. Homepage Changes (`index.html`)

### 2a. Constellation truncation

Show only the first 4 projects in order:
1. Integrating Thauma
2. Ouracle
3. SVNR
4. Beta signup block (stays in place between SVNR and Feelies)
5. Feelies

After Feelies, add a "More projects →" link pointing to `/projects`. Remove orfx, inkwell, LevelOut, nameless, easeness, and their interlude quotes from `index.html` — they move to `projects.html`.

### 2b. Work teaser section

New `.work-teaser` section after the constellation. Contains 4 logo cards:

| Client | Asset |
|--------|-------|
| Disney | `assets/work/disney/logo-disney.png` |
| Arrivo | `assets/work/arrivo/logo-arrivo.png` |
| SolarCity | `assets/work/solarcity/logo-solarcity.png` |
| Tiny Health | `assets/work/tiny-health/logo-tiny-health.svg` |

Each card: logo image + client name + link to `https://{client-url}`. Cards use `.glass` treatment. A "More work →" link follows the grid, pointing to `/work`.

### 2c. Email form copy

| Element | Current | New |
|---------|---------|-----|
| Heading | "Let's connect" | "Have a project in mind?" |
| Subtext / placeholder (note) | "What's up, doc?" | "Tell me what you're building." |
| Button | "Send" | "Let's talk" |

---

## 3. Projects Page (`projects.html`)

Standalone page. Structure:

```
<a class="name" href="/">Kerry Alan Snyder</a>
<section class="constellation">
  [All 9 projects + interlude quotes, same HTML as current index.html]
</section>
<footer>...</footer>
```

Projects in order (matching current index.html sequence):
1. Integrating Thauma
2. Ouracle
3. SVNR
4. Beta signup block
5. Feelies
6. orfx
7. inkwell ← + interlude before it
8. LevelOut ← + interlude before it
9. nameless ← + interlude before it
10. easeness ← + interlude before it

Background, vignette, ambient widget, and footer copied from `index.html`.

---

## 4. Work Page (`work.html`)

Standalone page. Structure:

```
<a class="name" href="/">Kerry Alan Snyder</a>
<section class="work-directory">
  [12 client cards]
</section>
<footer>...</footer>
```

### 4a. Client cards

Each card contains:
- Logo image (or project hero image where no logo exists)
- Client name as a link to the live site
- One-line role description (derived from JSON `content` field)
- 3–4 skill chips

Cards use `.glass` treatment, mobile-first grid (1 col on small, 2 col on medium+).

### 4b. All 12 clients

| Client | Logo asset | Role (one-liner) | Link |
|--------|-----------|------------------|------|
| Disney | `logo-disney.png` | Product Manager — blazing the trail to Disney+ and Magic Bands | https://disney.com |
| Arrivo | `logo-arrivo.png` | Operations Lead — envisioning the end of traffic | https://arrivoloop.com |
| SolarCity | `logo-solarcity.png` | Lead UX Designer — full-stack design and development | https://solarcity.com |
| Tiny Health | `logo-tiny-health.svg` | Lead Engineer — microbiome insights for parents | https://tinyhealth.com |
| Heylo | `logo-heylo.svg` | Software Engineer — community platform for group organizers | https://heylo.com |
| Togetherville | `logo-togetherville.png` | UX Designer — pioneering safe social for kids | https://togetherville.com |
| Summon | `logo-summon.png` | Product Designer — exploring the future of remote work | https://summonteam.com |
| Outline | `logo-outline.png` | Full-stack Developer — collaboration tools for institutional finance | https://outline.com |
| BMNT | `logo-bmnt.png` | Designer — web presence for Silicon Valley's defense design agency | https://bmnt.com |
| Mandarin9 | `logo-mandarin9.png` | Consultant — making Mandarin learnable for the western world | https://mandarin9.com |
| Escuela Marin | `logo-escuela-marin.svg` | Designer — gauging interest in a bilingual school | — |
| Talk Social | *(hero image)* | Full-stack Developer — serendipitous remote conversation | — |

### 4c. Light/dark logo strategy

The site uses `prefers-color-scheme` — dark by default, light override. Logos must adapt.

**`<picture>` with media query** for clients that have both variants:
```html
<picture>
  <source srcset="logo-disney.png" media="(prefers-color-scheme: light)">
  <img src="logo-disney-dark.png" alt="Disney">
</picture>
```
Clients with dark variants in krry.dev: Disney, Arrivo, SolarCity, Mandarin9, BMNT.

**SVG `currentColor`** for SVGs we own: modify Tiny Health and Escuela Marin fills to `currentColor` so they inherit `--text` automatically. Heylo's SVG is white-fill only — use CSS `filter: invert(1)` under `prefers-color-scheme: light`.

**CSS filter fallback** for single-variant PNGs (Togetherville, Summon, Outline): apply `filter: invert(1) brightness(0.85)` under `prefers-color-scheme: light` if the logo appears on a dark background, or vice versa. Check visually; not all logos invert cleanly — if a logo looks bad inverted, use it as-is and accept the contrast trade-off.

- Talk Social has no logo; use `talk-social-01.jpg` as a card hero image instead.

---

## 5. Asset Migration

Copy from `krry.dev/src/lib/assets/projects/` into `kerry.ink/assets/work/`:

```
assets/work/
  arrivo/        logo-arrivo.png, logo-arrivo-dark.png
  bmnt/          logo-bmnt.png, logo-bmnt-dark.png
  disney/        logo-disney.png, logo-disney-dark.png
  escuela-marin/ logo-escuela-marin.svg
  mandarin9/     logo-mandarin9.png, logo-mandarin9-dark.png
  outline/       logo-outline.png
  solarcity/     logo-solarcity.png, logo-solarcity-dark.png
  summon/        logo-summon.png
  talk-social/   talk-social-01.jpg
  tiny-health/   logo-tiny-health.svg  ← already downloaded
  togetherville/  logo-togetherville.png
  heylo/        logo-heylo.svg        ← already downloaded
```

---

## 6. CSS additions (in `styles.css`)

- `.work-teaser` section layout — matches constellation spacing
- `.work-card` — logo card with glass treatment, logo centered, name below
- `.work-directory` — 1→2 column responsive grid
- `.skill-chip` — small pill tag for skill labels
- `"More projects →"` / `"More work →"` link style — subtle, inline, matches site voice
