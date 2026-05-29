# Projects & Work Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/projects` and `/work` static HTML pages, truncate the homepage constellation, add a work teaser section, and update email form copy.

**Architecture:** Three standalone static HTML files sharing `styles.css` and `main.js`. No build step. New CSS classes added to `styles.css`. Logo assets migrated from `krry.dev` into `kerry.ink/assets/work/`. Navigation is scroll-based; the name links to `/` on all pages.

**Tech Stack:** Vanilla HTML/CSS/JS, Recursive variable font, `prefers-color-scheme` media queries, `<picture>` element for theme-adaptive logos.

---

## File Map

| Action | File |
|--------|------|
| Create | `projects.html` |
| Create | `work.html` |
| Modify | `index.html` |
| Modify | `styles.css` |
| Create | `assets/work/arrivo/logo-arrivo.png` + `logo-arrivo-dark.png` |
| Create | `assets/work/bmnt/logo-bmnt.png` + `logo-bmnt-dark.png` |
| Create | `assets/work/disney/logo-disney.png` + `logo-disney-dark.png` |
| Create | `assets/work/escuela-marin/logo-escuela-marin.svg` |
| Create | `assets/work/mandarin9/logo-mandarin9.png` + `logo-mandarin9-dark.png` |
| Create | `assets/work/outline/logo-outline.png` |
| Create | `assets/work/solarcity/logo-solarcity.png` + `logo-solarcity-dark.png` |
| Create | `assets/work/summon/logo-summon.png` |
| Create | `assets/work/talk-social/talk-social-01.jpg` |
| Create | `assets/work/togetherville/logo-togetherville.png` |
| Modify | `assets/work/tiny-health/logo-tiny-health.svg` ← already present, needs SVG edit |
| Already done | `assets/work/heylo/logo-heylo.svg` |

---

## Task 1: Migrate logo assets

**Files:**
- Create: `assets/work/` subdirectories with logos copied from `../krry.dev/src/lib/assets/projects/`

- [ ] **Step 1: Copy all logo assets**

```bash
SRC=../krry.dev/src/lib/assets/projects
DEST=./assets/work

mkdir -p $DEST/{arrivo,bmnt,disney,escuela-marin,mandarin9,outline,solarcity,summon,talk-social,togetherville}

cp $SRC/arrivo/logo-arrivo.png $DEST/arrivo/
cp $SRC/arrivo/logo-arrivo-dark.png $DEST/arrivo/
cp $SRC/bmnt/logo-bmnt.png $DEST/bmnt/
cp $SRC/bmnt/logo-bmnt-dark.png $DEST/bmnt/
cp $SRC/disney/logo-disney.png $DEST/disney/
cp $SRC/disney/logo-disney-dark.png $DEST/disney/
cp $SRC/escuela-marin/logo-escuela-marin.svg $DEST/escuela-marin/
cp $SRC/mandarin9/logo-mandarin9.png $DEST/mandarin9/
cp $SRC/mandarin9/logo-mandarin9-dark.png $DEST/mandarin9/
cp $SRC/outline/logo-outline.png $DEST/outline/
cp $SRC/solarcity/logo-solarcity.png $DEST/solarcity/
cp $SRC/solarcity/logo-solarcity-dark.png $DEST/solarcity/
cp $SRC/summon/logo-summon.png $DEST/summon/
cp $SRC/talk-social/talk-social-01.jpg $DEST/talk-social/
cp $SRC/togetherville/logo-togetherville.png $DEST/togetherville/
```

- [ ] **Step 2: Verify all files landed**

```bash
find ./assets/work -type f | sort
```

Expected: 17 files across 12 directories (tiny-health and heylo already present).

- [ ] **Step 3: Commit**

```bash
git add assets/work/
git commit -m "chore: migrate work logo assets from krry.dev"
```

---

## Task 2: Modify SVGs for theme adaptation

**Files:**
- Modify: `assets/work/tiny-health/logo-tiny-health.svg`

The Tiny Health SVG has `fill="#3B3941"` (near-black) — invisible on the site's dark background. Replace with `currentColor` so it inherits `--text` and adapts to both modes automatically.

Heylo's SVG is already `fill="white"` — correct for dark mode. Light-mode adaptation is handled via CSS in Task 3.

- [ ] **Step 1: Replace hardcoded fill in Tiny Health SVG**

```bash
sed -i '' 's/fill="#3B3941"/fill="currentColor"/g' ./assets/work/tiny-health/logo-tiny-health.svg
```

- [ ] **Step 2: Verify the change**

```bash
grep 'fill=' ./assets/work/tiny-health/logo-tiny-health.svg
```

Expected output: only `fill="currentColor"` and `fill="none"` — no hex colors.

- [ ] **Step 3: Commit**

```bash
git add assets/work/tiny-health/logo-tiny-health.svg
git commit -m "chore: convert Tiny Health SVG fills to currentColor for theme adaptation"
```

---

## Task 3: Add CSS for new components

**Files:**
- Modify: `styles.css` (append to end of file)

- [ ] **Step 1: Add all new CSS**

Append the following block to the end of `styles.css`:

```css
/* --- sub-page compact hero --- */

.hero--compact {
	min-height: unset;
	padding: var(--vr-7) var(--vr-5) var(--vr-5);
}

.hero--compact .links {
	width: auto;
	max-width: 600px;
	padding: var(--vr-5) var(--vr-6);
}

/* --- more link --- */

.more-link {
	display: inline-block;
	color: var(--muted);
	font-size: 0.9rem;
	font-variation-settings: "wght" 500, "CASL" 0.3, "CRSV" 0, "MONO" 0;
	letter-spacing: 0.04em;
	text-decoration: none;
	padding: var(--vr-3) var(--vr-4);
	border-radius: 100px;
	border: 1px solid color-mix(in srgb, var(--text) 14%, transparent);
	transition: color var(--transition), border-color var(--transition);
	&:hover {
		color: var(--text);
		border-color: color-mix(in srgb, var(--text) 38%, transparent);
	}
}

.more-link-wrap {
	display: flex;
	justify-content: center;
	padding: var(--vr-5) 0 var(--vr-6);
}

/* --- work teaser (homepage) --- */

.work-teaser {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--vr-5);
	padding: 10vh var(--vr-5) 15vh;
}

.work-teaser__heading {
	margin: 0;
	font-size: clamp(15px, 2.2vw, 22px);
	font-variation-settings: "wght" 600, "CASL" 0.4, "CRSV" 0, "MONO" 0;
	color: var(--muted);
	text-align: center;
	letter-spacing: -0.01em;
}

.work-teaser__grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--vr-4);
	width: 100%;
	max-width: 580px;
}

@media (max-width: 480px) {
	.work-teaser__grid {
		grid-template-columns: 1fr;
	}
}

/* --- work card (teaser + directory) --- */

.work-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--vr-3);
	padding: var(--vr-5);
	border-radius: 16px;
	text-decoration: none;
	min-height: 110px;
	transition: transform var(--transition) ease, box-shadow var(--transition) ease;
	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 32px 100px var(--shadow);
	}
}

.work-card__logo {
	max-height: 36px;
	max-width: 150px;
	width: auto;
	object-fit: contain;
	display: block;
}

.work-card__name {
	font-size: 0.78rem;
	color: var(--muted);
	font-variation-settings: "wght" 400, "CASL" 0.2, "CRSV" 0, "MONO" 0;
	margin: 0;
	text-align: center;
}

/* --- work directory (/work page) --- */

.work-directory {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--vr-5);
	padding: 6vh var(--vr-5) 15vh;
	max-width: 900px;
	margin: 0 auto;
	width: 100%;
}

@media (max-width: 600px) {
	.work-directory {
		grid-template-columns: 1fr;
	}
}

.work-entry {
	display: flex;
	flex-direction: column;
	gap: var(--vr-3);
	padding: var(--vr-5);
	border-radius: 16px;
}

.work-entry__logo {
	max-height: 40px;
	max-width: 180px;
	width: auto;
	object-fit: contain;
	display: block;
}

.work-entry__name {
	font-size: 1rem;
	font-variation-settings: "wght" 700, "CASL" 0.3, "CRSV" 0, "MONO" 0;
	color: var(--text);
	text-decoration: none;
	letter-spacing: -0.01em;
	&:hover {
		text-decoration: underline;
	}
}

.work-entry__role {
	font-size: 0.82rem;
	color: var(--muted);
	font-variation-settings: "wght" 400, "CASL" 0.2, "CRSV" 0, "MONO" 0;
	margin: 0;
	line-height: 1.5;
}

.work-entry__skills {
	display: flex;
	flex-wrap: wrap;
	gap: var(--vr-2);
	list-style: none;
	margin: 0;
	padding: 0;
}

/* --- skill chips --- */

.skill-chip {
	font-size: 0.7rem;
	padding: 2px 8px;
	border-radius: 100px;
	background: color-mix(in srgb, var(--text) 8%, transparent);
	border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
	color: var(--muted);
	font-variation-settings: "wght" 400, "CASL" 0, "CRSV" 0, "MONO" 0.5;
	white-space: nowrap;
}

/* --- work logo theme adaptation --- */

/* Heylo: white SVG fill — works dark mode (default), invert for light */
.work-logo--invert-light {
	filter: none;
}
@media (prefers-color-scheme: light) {
	.work-logo--invert-light {
		filter: invert(1) brightness(0.85);
	}
}

/* Summon: dark logo on transparent — needs invert in dark mode */
.work-logo--invert-dark {
	filter: invert(1) brightness(0.9);
}
@media (prefers-color-scheme: light) {
	.work-logo--invert-dark {
		filter: none;
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add CSS for compact hero, work teaser, work directory, skill chips"
```

---

## Task 4: Create `projects.html`

**Files:**
- Create: `projects.html`

- [ ] **Step 1: Create the file**

Create `projects.html` with this exact content:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kerry.ink • Projects — Kerry Alan Snyder</title>
        <meta name="description" content="Projects by Kerry Alan Snyder — software, iOS apps, and creative tools." />
        <link rel="canonical" href="https://kerry.ink/projects" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://kerry.ink/projects" />
        <meta property="og:title"       content="kerry.ink • Projects — Kerry Alan Snyder" />
        <meta property="og:description" content="Projects by Kerry Alan Snyder — software, iOS apps, and creative tools." />
        <meta property="og:image"       content="https://kerry.ink/assets/og-image.jpg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="kerry.ink • Projects — Kerry Alan Snyder" />
        <meta name="twitter:description" content="Projects by Kerry Alan Snyder — software, iOS apps, and creative tools." />
        <meta name="twitter:image"       content="https://kerry.ink/assets/og-image.jpg" />
        <link rel="icon" type="image/png" href="/favicon.png">
        <link rel="apple-touch-icon" href="/favicon.png">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="./styles.css" />
    </head>
    <body>
        <div class="bg" aria-hidden="true"></div>
        <div class="vignette" aria-hidden="true"></div>
        <a class="name" href="/" aria-label="Kerry Alan Snyder">Kerry Alan Snyder</a>

        <main>
            <section class="hero hero--compact" aria-label="Projects">
                <nav class="glass links" aria-label="Page heading">
                    <h1 class="headline">Projects</h1>
                </nav>
            </section>

            <section class="constellation" aria-label="All projects">

                <h3 class="interlude">Every point is the center, <br/>where the deep well waits.</h3>

                <div class="project">
                    <figure class="project__shot">
                        <img src="./assets/shots/thauma-hero.webp" alt="Thauma Integration — a trauma-informed journey from ground to grace and back" loading="lazy" />
                    </figure>
                    <div class="glass project__card">
                        <a href="https://thauma.kerry.ink" class="project__name">Integrating Thauma</a>
                        <p class="project__desc">A trauma-informed journey from ground to grace and back — tracing the octave of freedom to love.</p>
                        <p class="project__date">Ten Greek loves, ten frequencies — a book, audiobook, and talks</p>
                    </div>
                </div>

                <h3 class="interlude">The message is the medium <br/>and vice versa.</h3>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/ouracle.mp4" poster="./assets/shots/ouracle-poster.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://ouracle.kerry.ink" class="project__name">Ouracle</a>
                        <p class="project__desc">draws on any written wisdom tradition to connect you with a message that draws you deeper into the beauty of your self at this moment. (iOS beta opening soon.)</p>
                        <p class="project__date">Conceived and developed since March 2026 ➠</p>
                    </div>
                </div>

                <h3 class="interlude">Weaving nests in 5-D, <br/>where choice is free,<br/>where more playing is winning.</h3>

                <div class="project">
                    <figure class="project__shot">
                        <video data-src="./assets/shots/svnr.mp4" poster="./assets/shots/svnr-poster.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://svnr.kerry.ink" class="project__name">SVNR</a>
                        <p class="project__desc">relationships as keepsakes — new, old, borrowed, and blue; connect, refresh, and reinstall trust in society</p>
                        <p class="project__date">Conceived January 2026 ➠ iOS beta by March</p>
                    </div>
                </div>

                <h3 class="interlude">We are pretty out of tune, <br/>but the band is itching <br/>to get back together.</h3>

                <div class="project">
                    <figure class="project__shot">
                        <img src="./assets/shots/vesta-teaser.webp" alt="Feelies app screenshot" loading="lazy" />
                    </figure>
                    <div class="glass project__card">
                        <a href="https://feelies.kerry.ink" class="project__name">Feelies</a>
                        <p class="project__desc">sosh is over. feelings are true. every day, you are anew… and weird like us. let's play. (coming soon to iOS)</p>
                        <p class="project__date">Conceived and prototyped in April 2026, in 2 days</p>
                    </div>
                </div>

                <section class="beta-signup glass" id="beta">
                    <h3 class="beta-signup__heading">Join the iOS beta</h3>
                    <p class="beta-signup__sub">TestFlight invites for SVNR and Feelies. Drop your Apple ID email and I'll add you.</p>
                    <form class="beta-signup__form" id="betaForm">
                        <div class="beta-signup__checks">
                            <label class="beta-signup__check">
                                <input type="checkbox" name="apps" value="SVNR" checked />
                                <span>SVNR</span>
                            </label>
                            <label class="beta-signup__check">
                                <input type="checkbox" name="apps" value="Feelies" checked />
                                <span>Feelies</span>
                            </label>
                        </div>
                        <div class="beta-signup__row">
                            <input type="text" name="name" placeholder="name (optional)" class="beta-signup__input" autocomplete="name" />
                            <input type="email" name="email" placeholder="Apple ID email" class="beta-signup__input beta-signup__input--email" required autocomplete="email" />
                            <button type="submit" class="beta-signup__btn">request invite</button>
                        </div>
                        <p class="beta-signup__status" aria-live="polite"></p>
                    </form>
                </section>

                <h3 class="interlude">Our mind now expands to the limit <br/>of our willingness to surrender.</h3>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/orfx.mp4" poster="./assets/shots/orfx-poster.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://orfx.kerry.ink" class="project__name">orfx</a>
                        <p class="project__desc">Worfeus and his team of 9 orphic agents craft and keep their own agent-first blog.</p>
                        <p class="project__date">Conceived and built in January 2026, in 20 minutes</p>
                    </div>
                </div>

                <h3 class="interlude">How might we enjoy discovering <br/>and dissolving those limitations?</h3>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/inkwell.mp4" poster="./assets/shots/inkwell.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://inkwell.kerry.ink" class="project__name">inkwell</a>
                        <p class="project__desc">We can literally draw our shadows out into the light.</p>
                        <p class="project__date">Conceived and built in March 2023, in 1 day</p>
                    </div>
                </div>

                <h3 class="interlude">Abundance might just be<br/>but a limiting belief away.</h3>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/levelout.mp4" poster="./assets/shots/levelout.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://level.out.kerry.ink" class="project__name">LevelOut</a>
                        <p class="project__desc">A paean to the more beautiful world our hearts know is probable.</p>
                        <p class="project__date">Conceived and built in mid 2020</p>
                    </div>
                </div>

                <h3 class="interlude">Terence McKenna considered <br/>the Yìjīng on par with nuclear fission, <br/>as technology goes.</h3>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/nameless.mp4" poster="./assets/shots/nameless.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://nameless.kerry.ink" class="project__name">nameless</a>
                        <p class="project__desc">Who said a magical portal to the truth of the moment can't be whimsical?</p>
                        <p class="project__date">Conceived and built in early 2020</p>
                    </div>
                </div>

                <h3 class="interlude">If we take the opposite of disease, <br/>and the opposite of business <br/>and make a soup-sandwich…</h3>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/easeness.mp4" poster="./assets/shots/easeness.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://easeness.kerry.ink" class="project__name">easeness</a>
                        <p class="project__desc">As work becomes nonessential, one wonders whether we want to stay busy, or be easy.</p>
                        <p class="project__date">Conceived and built in 2020</p>
                    </div>
                </div>

                <h3 class="interlude">The truth may be <br/>as plain as the nose on our face, <br/>but that doesn't make it easy to see.</h3>

            </section>
        </main>

        <footer>
            <span class="flipX">&copy;</span>
            <span id="year"></span>
            <span>KAS</span>
        </footer>

        <dialog class="lightbox" id="lightbox" aria-label="Full image">
            <div class="lightbox__media"></div>
        </dialog>

        <ambient-widget scene="binaural" position="top-right" theme="auto"></ambient-widget>
        <script src="./widgets/ambient/ambient.wc.js"></script>
        <script src="./widgets/webring/webring.wc.js" position="bottom-right"></script>
        <webring-widget data-source="./widgets/webring/webring.json" theme="auto" size="small" position="top-left"></webring-widget>
        <script type="module" src="./main.js"></script>
    </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add projects.html
git commit -m "feat: add /projects page with full constellation and interludes"
```

---

## Task 5: Create `work.html`

**Files:**
- Create: `work.html`

- [ ] **Step 1: Create the file**

Create `work.html` with this exact content:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kerry.ink • Work — Kerry Alan Snyder</title>
        <meta name="description" content="Client work and employment history — Kerry Alan Snyder, software engineer and experience designer." />
        <link rel="canonical" href="https://kerry.ink/work" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://kerry.ink/work" />
        <meta property="og:title"       content="kerry.ink • Work — Kerry Alan Snyder" />
        <meta property="og:description" content="Client work and employment history — Kerry Alan Snyder, software engineer and experience designer." />
        <meta property="og:image"       content="https://kerry.ink/assets/og-image.jpg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="kerry.ink • Work — Kerry Alan Snyder" />
        <meta name="twitter:description" content="Client work and employment history — Kerry Alan Snyder, software engineer and experience designer." />
        <meta name="twitter:image"       content="https://kerry.ink/assets/og-image.jpg" />
        <link rel="icon" type="image/png" href="/favicon.png">
        <link rel="apple-touch-icon" href="/favicon.png">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="./styles.css" />
    </head>
    <body>
        <div class="bg" aria-hidden="true"></div>
        <div class="vignette" aria-hidden="true"></div>
        <a class="name" href="/" aria-label="Kerry Alan Snyder">Kerry Alan Snyder</a>

        <main>
            <section class="hero hero--compact" aria-label="Work">
                <nav class="glass links" aria-label="Page heading">
                    <h1 class="headline">Work</h1>
                </nav>
            </section>

            <section class="work-directory" aria-label="Client work">

                <!-- Disney Interactive -->
                <div class="glass work-entry">
                    <picture>
                        <source srcset="./assets/work/disney/logo-disney.png" media="(prefers-color-scheme: light)">
                        <img class="work-entry__logo" src="./assets/work/disney/logo-disney-dark.png" alt="Disney Interactive logo">
                    </picture>
                    <a class="work-entry__name" href="https://disney.com" target="_blank" rel="noopener">Disney Interactive</a>
                    <p class="work-entry__role">Product Manager — blazing the trail to Disney+ and Magic Bands</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">Product design</li>
                        <li class="skill-chip">Game design</li>
                        <li class="skill-chip">Platform integration</li>
                        <li class="skill-chip">Identity platforms</li>
                    </ul>
                </div>

                <!-- Arrivo Hyperloop -->
                <div class="glass work-entry">
                    <picture>
                        <source srcset="./assets/work/arrivo/logo-arrivo.png" media="(prefers-color-scheme: light)">
                        <img class="work-entry__logo" src="./assets/work/arrivo/logo-arrivo-dark.png" alt="Arrivo Hyperloop logo">
                    </picture>
                    <a class="work-entry__name" href="https://arrivoloop.com" target="_blank" rel="noopener">Arrivo Hyperloop</a>
                    <p class="work-entry__role">Operations Lead — envisioning the end of traffic</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">IT strategy</li>
                        <li class="skill-chip">Web design</li>
                        <li class="skill-chip">UI/UX design</li>
                        <li class="skill-chip">Market research</li>
                    </ul>
                </div>

                <!-- SolarCity (now Tesla) -->
                <div class="glass work-entry">
                    <picture>
                        <source srcset="./assets/work/solarcity/logo-solarcity.png" media="(prefers-color-scheme: light)">
                        <img class="work-entry__logo" src="./assets/work/solarcity/logo-solarcity-dark.png" alt="SolarCity logo">
                    </picture>
                    <a class="work-entry__name" href="https://tesla.com/energy" target="_blank" rel="noopener">SolarCity (now Tesla)</a>
                    <p class="work-entry__role">Lead UX Designer — full-stack design and development</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">Prototyping</li>
                        <li class="skill-chip">User Research</li>
                        <li class="skill-chip">Node.js</li>
                        <li class="skill-chip">CSS</li>
                    </ul>
                </div>

                <!-- Tiny Health -->
                <div class="glass work-entry">
                    <img class="work-entry__logo" src="./assets/work/tiny-health/logo-tiny-health.svg" alt="Tiny Health logo">
                    <a class="work-entry__name" href="https://tinyhealth.com" target="_blank" rel="noopener">Tiny Health</a>
                    <p class="work-entry__role">Lead Engineer — microbiome insights for parents</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">React</li>
                        <li class="skill-chip">Node.js</li>
                        <li class="skill-chip">Serverless</li>
                        <li class="skill-chip">AWS</li>
                    </ul>
                </div>

                <!-- Heylo -->
                <div class="glass work-entry">
                    <img class="work-entry__logo work-logo--invert-light" src="./assets/work/heylo/logo-heylo.svg" alt="Heylo logo">
                    <a class="work-entry__name" href="https://heylo.com" target="_blank" rel="noopener">Heylo</a>
                    <p class="work-entry__role">Software Engineer — community platform for group organizers</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">React</li>
                        <li class="skill-chip">TypeScript</li>
                        <li class="skill-chip">Node.js</li>
                        <li class="skill-chip">AWS</li>
                    </ul>
                </div>

                <!-- Togetherville -->
                <div class="glass work-entry">
                    <img class="work-entry__logo" src="./assets/work/togetherville/logo-togetherville.png" alt="Togetherville logo">
                    <a class="work-entry__name" href="https://togetherville.com" target="_blank" rel="noopener">Togetherville</a>
                    <p class="work-entry__role">UX Designer — pioneering safe social for kids</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">Content strategy</li>
                        <li class="skill-chip">UI/UX design</li>
                        <li class="skill-chip">Gamification</li>
                        <li class="skill-chip">Privacy law</li>
                    </ul>
                </div>

                <!-- Summon -->
                <div class="glass work-entry">
                    <img class="work-entry__logo work-logo--invert-dark" src="./assets/work/summon/logo-summon.png" alt="Summon logo">
                    <a class="work-entry__name" href="https://summonteam.com" target="_blank" rel="noopener">Summon</a>
                    <p class="work-entry__role">Product Designer — exploring the future of remote work</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">React</li>
                        <li class="skill-chip">TypeScript</li>
                        <li class="skill-chip">Product design</li>
                        <li class="skill-chip">User research</li>
                    </ul>
                </div>

                <!-- Outline -->
                <div class="glass work-entry">
                    <img class="work-entry__logo" src="./assets/work/outline/logo-outline.png" alt="Outline logo">
                    <a class="work-entry__name" href="https://outline.com" target="_blank" rel="noopener">Outline</a>
                    <p class="work-entry__role">Full-stack Developer — collaboration tools for institutional finance</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">React</li>
                        <li class="skill-chip">TypeScript</li>
                        <li class="skill-chip">Data visualization</li>
                        <li class="skill-chip">UI/UX design</li>
                    </ul>
                </div>

                <!-- BMNT -->
                <div class="glass work-entry">
                    <picture>
                        <source srcset="./assets/work/bmnt/logo-bmnt.png" media="(prefers-color-scheme: light)">
                        <img class="work-entry__logo" src="./assets/work/bmnt/logo-bmnt-dark.png" alt="BMNT logo">
                    </picture>
                    <a class="work-entry__name" href="https://bmnt.com" target="_blank" rel="noopener">BMNT</a>
                    <p class="work-entry__role">Designer — web presence for Silicon Valley's defense design agency</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">Branding</li>
                        <li class="skill-chip">Webflow</li>
                        <li class="skill-chip">Prototyping</li>
                        <li class="skill-chip">Responsive design</li>
                    </ul>
                </div>

                <!-- Mandarin9 -->
                <div class="glass work-entry">
                    <picture>
                        <source srcset="./assets/work/mandarin9/logo-mandarin9.png" media="(prefers-color-scheme: light)">
                        <img class="work-entry__logo" src="./assets/work/mandarin9/logo-mandarin9-dark.png" alt="Mandarin9 logo">
                    </picture>
                    <a class="work-entry__name" href="https://mandarin9.com" target="_blank" rel="noopener">Mandarin9</a>
                    <p class="work-entry__role">Consultant — making Mandarin learnable for the western world</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">Consulting</li>
                        <li class="skill-chip">Prototyping</li>
                        <li class="skill-chip">Tech strategy</li>
                        <li class="skill-chip">Content strategy</li>
                    </ul>
                </div>

                <!-- Escuela Marin -->
                <div class="glass work-entry">
                    <img class="work-entry__logo" src="./assets/work/escuela-marin/logo-escuela-marin.svg" alt="Escuela Marin logo">
                    <span class="work-entry__name">Escuela Marin</span>
                    <p class="work-entry__role">Designer — gauging interest in a new bilingual school</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">Webflow</li>
                        <li class="skill-chip">Prototyping</li>
                        <li class="skill-chip">SEO</li>
                        <li class="skill-chip">Web design</li>
                    </ul>
                </div>

                <!-- Talk Social -->
                <div class="glass work-entry">
                    <img class="work-entry__logo" src="./assets/work/talk-social/talk-social-01.jpg" alt="Talk Social screenshot" style="border-radius:8px; max-height:60px; max-width:100%;">
                    <span class="work-entry__name">Talk Social</span>
                    <p class="work-entry__role">Full-stack Developer — serendipitous remote conversation</p>
                    <ul class="work-entry__skills">
                        <li class="skill-chip">React</li>
                        <li class="skill-chip">TypeScript</li>
                        <li class="skill-chip">Ruby on Rails</li>
                        <li class="skill-chip">WebRTC</li>
                    </ul>
                </div>

            </section>
        </main>

        <footer>
            <span class="flipX">&copy;</span>
            <span id="year"></span>
            <span>KAS</span>
        </footer>

        <dialog class="lightbox" id="lightbox" aria-label="Full image">
            <div class="lightbox__media"></div>
        </dialog>

        <ambient-widget scene="binaural" position="top-right" theme="auto"></ambient-widget>
        <script src="./widgets/ambient/ambient.wc.js"></script>
        <script src="./widgets/webring/webring.wc.js" position="bottom-right"></script>
        <webring-widget data-source="./widgets/webring/webring.json" theme="auto" size="small" position="top-left"></webring-widget>
        <script type="module" src="./main.js"></script>
    </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add work.html
git commit -m "feat: add /work page with 12 client cards"
```

---

## Task 6: Update `index.html`

**Files:**
- Modify: `index.html`

Three changes: (a) truncate constellation, (b) add work teaser, (c) update email form copy.

### 6a — Truncate constellation

- [ ] **Step 1: Remove all interludes and the 5 overflow projects from the constellation**

In `index.html`, replace the entire `<section class="constellation" ...>` block (currently lines 169–416) with this trimmed version:

```html
            <!-- Constellation — featured projects -->
            <section class="constellation" aria-label="Projects">

                <div class="project">
                    <figure class="project__shot">
                        <img src="./assets/shots/thauma-hero.webp" alt="Thauma Integration — a trauma-informed journey from ground to grace and back" loading="lazy" />
                    </figure>
                    <div class="glass project__card">
                        <a href="https://thauma.kerry.ink" class="project__name">Integrating Thauma</a>
                        <p class="project__desc">A trauma-informed journey from ground to grace and back — tracing the octave of freedom to love.</p>
                        <p class="project__date">Ten Greek loves, ten frequencies — a book, audiobook, and talks</p>
                    </div>
                </div>

                <div class="project">
                    <figure class="project__shot project__shot--wide">
                        <video data-src="./assets/shots/ouracle.mp4" poster="./assets/shots/ouracle-poster.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://ouracle.kerry.ink" class="project__name">Ouracle</a>
                        <p class="project__desc">draws on any written wisdom tradition to connect you with a message that draws you deeper into the beauty of your self at this moment. (iOS beta opening soon.)</p>
                        <p class="project__date">Conceived and developed since March 2026 ➠</p>
                    </div>
                </div>

                <div class="project">
                    <figure class="project__shot">
                        <video data-src="./assets/shots/svnr.mp4" poster="./assets/shots/svnr-poster.webp" autoplay loop muted playsinline preload="none"></video>
                    </figure>
                    <div class="glass project__card">
                        <a href="https://svnr.kerry.ink" class="project__name">SVNR</a>
                        <p class="project__desc">relationships as keepsakes — new, old, borrowed, and blue; connect, refresh, and reinstall trust in society</p>
                        <p class="project__date">Conceived January 2026 ➠ iOS beta by March</p>
                    </div>
                </div>

                <div class="project">
                    <figure class="project__shot">
                        <img src="./assets/shots/vesta-teaser.webp" alt="Feelies app screenshot" loading="lazy" />
                    </figure>
                    <div class="glass project__card">
                        <a href="https://feelies.kerry.ink" class="project__name">Feelies</a>
                        <p class="project__desc">sosh is over. feelings are true. every day, you are anew… and weird like us. let's play. (coming soon to iOS)</p>
                        <p class="project__date">Conceived and prototyped in April 2026, in 2 days</p>
                    </div>
                </div>

                <section class="beta-signup glass" id="beta">
                    <h3 class="beta-signup__heading">Join the iOS beta</h3>
                    <p class="beta-signup__sub">TestFlight invites for SVNR and Feelies. Drop your Apple ID email and I'll add you.</p>
                    <form class="beta-signup__form" id="betaForm">
                        <div class="beta-signup__checks">
                            <label class="beta-signup__check">
                                <input type="checkbox" name="apps" value="SVNR" checked />
                                <span>SVNR</span>
                            </label>
                            <label class="beta-signup__check">
                                <input type="checkbox" name="apps" value="Feelies" checked />
                                <span>Feelies</span>
                            </label>
                        </div>
                        <div class="beta-signup__row">
                            <input type="text" name="name" placeholder="name (optional)" class="beta-signup__input" autocomplete="name" />
                            <input type="email" name="email" placeholder="Apple ID email" class="beta-signup__input beta-signup__input--email" required autocomplete="email" />
                            <button type="submit" class="beta-signup__btn">request invite</button>
                        </div>
                        <p class="beta-signup__status" aria-live="polite"></p>
                    </form>
                </section>

                <div class="more-link-wrap">
                    <a href="/projects" class="more-link">More projects →</a>
                </div>

            </section>
```

### 6b — Add work teaser

- [ ] **Step 2: Add work teaser section immediately after the closing `</section>` of the constellation, before `<section class="gratitude">`**

```html
            <!-- Work teaser -->
            <section class="work-teaser" aria-label="Selected work">
                <h2 class="work-teaser__heading">Selected work</h2>
                <div class="work-teaser__grid">

                    <a class="glass work-card" href="https://disney.com" target="_blank" rel="noopener" aria-label="Disney Interactive">
                        <picture>
                            <source srcset="./assets/work/disney/logo-disney.png" media="(prefers-color-scheme: light)">
                            <img class="work-card__logo" src="./assets/work/disney/logo-disney-dark.png" alt="Disney Interactive">
                        </picture>
                        <p class="work-card__name">Disney Interactive</p>
                    </a>

                    <a class="glass work-card" href="https://arrivoloop.com" target="_blank" rel="noopener" aria-label="Arrivo Hyperloop">
                        <picture>
                            <source srcset="./assets/work/arrivo/logo-arrivo.png" media="(prefers-color-scheme: light)">
                            <img class="work-card__logo" src="./assets/work/arrivo/logo-arrivo-dark.png" alt="Arrivo Hyperloop">
                        </picture>
                        <p class="work-card__name">Arrivo Hyperloop</p>
                    </a>

                    <a class="glass work-card" href="https://tesla.com/energy" target="_blank" rel="noopener" aria-label="SolarCity (now Tesla)">
                        <picture>
                            <source srcset="./assets/work/solarcity/logo-solarcity.png" media="(prefers-color-scheme: light)">
                            <img class="work-card__logo" src="./assets/work/solarcity/logo-solarcity-dark.png" alt="SolarCity (now Tesla)">
                        </picture>
                        <p class="work-card__name">SolarCity (now Tesla)</p>
                    </a>

                    <a class="glass work-card" href="https://tinyhealth.com" target="_blank" rel="noopener" aria-label="Tiny Health">
                        <img class="work-card__logo" src="./assets/work/tiny-health/logo-tiny-health.svg" alt="Tiny Health">
                        <p class="work-card__name">Tiny Health</p>
                    </a>

                </div>
                <div class="more-link-wrap">
                    <a href="/work" class="more-link">More work →</a>
                </div>
            </section>
```

### 6c — Update email form copy

- [ ] **Step 3: Update the email form heading, note placeholder, and submit button**

Find this block in `index.html`:
```html
                        <h2>Let's connect</h2>
                        <label for="email" class="email-label">Email</label>
                        <input type="email" name="email" placeholder="your@email.net" required id="email" class="email-input" autocomplete="email">
                        <label for="note-input" class="email-label">Note</label>
                        <textarea name="note" id="note-input" class="email-note" rows="3" placeholder="What's up, doc?"></textarea>
                        <button type="submit" class="email-submit">Send</button>
```

Replace with:
```html
                        <h2>Have a project in mind?</h2>
                        <label for="email" class="email-label">Email</label>
                        <input type="email" name="email" placeholder="your@email.net" required id="email" class="email-input" autocomplete="email">
                        <label for="note-input" class="email-label">Note</label>
                        <textarea name="note" id="note-input" class="email-note" rows="3" placeholder="Tell me what you're building."></textarea>
                        <button type="submit" class="email-submit">Let's talk</button>
```

- [ ] **Step 4: Commit all index.html changes**

```bash
git add index.html
git commit -m "feat: truncate homepage constellation, add work teaser, update email form copy"
```

---

## Task 7: Update `vercel.json` for clean URLs

**Files:**
- Modify: `vercel.json`

Vercel serves `projects.html` at `/projects.html` by default. Add rewrites so `/projects` and `/work` resolve cleanly.

- [ ] **Step 1: Check current vercel.json**

```bash
cat vercel.json
```

- [ ] **Step 2: Add clean URL rewrites**

If `vercel.json` doesn't already have a `cleanUrls` or `rewrites` field, add:

```json
{
  "cleanUrls": true
}
```

If it already has content, merge `"cleanUrls": true` into the existing object.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore: enable cleanUrls for /projects and /work"
```

---

## Task 8: Final verification

- [ ] **Step 1: Open the site locally and check all three pages**

```bash
npx serve . -p 3000
```

Open:
- `http://localhost:3000` — homepage: 4 projects, no interludes, work teaser, "More projects →" + "More work →" links, updated email form
- `http://localhost:3000/projects` — compact hero "Projects" with morph, full 9-project constellation with all interludes
- `http://localhost:3000/work` — compact hero "Work" with morph, 12 client cards with logos

- [ ] **Step 2: Test light mode**

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-color-scheme: light`. Verify logos with dark variants swap correctly (Disney, Arrivo, SolarCity, Mandarin9, BMNT). Verify Heylo SVG inverts. Verify Tiny Health SVG stays readable.

- [ ] **Step 3: Test mobile (375px)**

In DevTools, set viewport to 375px wide. Verify:
- Work teaser grid collapses to 1 column
- Work directory grid collapses to 1 column
- Compact hero headline fits without overflow
- All logo images are constrained and not overflowing cards

- [ ] **Step 4: Commit and push**

```bash
git add -A
git status  # confirm nothing unexpected
git push origin main
```
