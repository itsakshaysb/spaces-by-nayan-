# DESIGN.md — Spaces by Nayan · Portfolio Website Build Spec
2
> Source-of-truth build document for Claude Code.
> Two-page, image-forward portfolio in the editorial "quiet-luxury" studio style
> (reference feel: telhaclarke.com.au). Build in phases — see §9.
>
> **Copy status:** all text below is polished DRAFT. Swap real facts where marked
> `{{ }}`, rearrange freely. Nothing here is invented as final.

---

## 0. Locked decisions & fill-in checklist

**Locked:**
- Brand: **Spaces by Nayan** · Designer: **Nayan** · Based in **Mumbai**
- Structure: **two pages** — Home + Project page
- Motion: **full treatment** (preloader, smooth scroll, masked reveals, parallax, custom cursor, page transitions)
- Contact = section on Home + footer (no separate page). Mission = "Approach" section on Home.
- Palette: near-monochrome; **color comes from the photographs only**
- Instagram: `@spacesbynayan`

**Resolved 2026-07-04 (discussion with Akshay + photo review):**

| Token | Decision | Status |
|---|---|---|
| Wordmark casing | Title case: "Spaces by Nayan" | ☑ |
| `{{THESIS_LINE}}` | Option 3: *Interiors shaped by how you live — intimate, practical, timeless.* | ☑ |
| ~~`{{ABOUT}}` / ethos~~ | ✅ Written from Nayan's words (§7.1) | ☑ |
| Voice | **Studio voice** ("Spaces by Nayan designs…", "we") | ☑ |
| `{{PROJECT_TITLE}}` | **"A Mumbai Apartment"** — client stays anonymous (family name "Kandhari's" appears on the entrance sign; do **not** publish it) | ☑ |
| `{{PROJECT_TYPE}}` / `{{LOCATION}}` | Apartment · Mumbai | ☑ |
| Room list | 6 rooms, see §0.1 photo map | ☑ |
| Image files | Optimized to `assets/images/` — WebP 800/1400/2000w + JPG 1400w fallback | ☑ |
| Hosting | **Decide later.** Form built Formspree-style so it works on any host; pick host at Phase 9 | ☑ |

**Still to fill in:**

| Token | Meaning | Status |
|---|---|---|
| `{{YEAR}}` / `{{SCOPE}}` | Project year + scope (ask Nayan); YEAR row omitted from facts block until known | ☐ |
| `{{EMAIL}}` / `{{PHONE}}` | Contact details (placeholder `hello@spacesbynayan.example` in code — must replace) | ☐ |
| Formspree form ID | Set `FORM_ENDPOINT` in `js/main.js` (mailto fallback active until then) | ☐ |
| Hosting | GitHub Pages / Netlify / Vercel / custom domain | ☐ |

### 0.1 Photo map (from `drive-download-20260704T185033Z-3-001/`)

One cohesive apartment: walnut, beige marble, fluted glass, brass, linen. All frames portrait/near-square except DSC07190 (landscape). Walkthrough order:

| # | Room | Photos (DSC) | Note |
|---|---|---|---|
| 01 | Living | 07190 (landscape, hero), 07204, 07226, 07238, 07246 | Strongest set; 07190 = Home hero |
| 02 | Dining | 07372, 07379, 07396 | 07396 (through fluted-glass doors) = Home featured-project teaser |
| 03 | Pooja niche | 07427 | Backlit lotus mural — single centered portrait |
| 04 | Primary bedroom | 07264, 07271, 07287 (07292 spare) | Chinoiserie panels, blue headboard |
| 05 | Bedroom two | 07304, 07326, 07344 | Charcoal headboard, moodier |
| 06 | Bedroom three / study | 07460, 07474, 07495 | Sage fluted panels, wildflower mural |
| — | Entrance | 07443-1 (truncated file), 07443-2 | **Unused:** "Kandhari's" name sign visible; client anonymous. Slots back in as room 01 if a retouched shot arrives |

Materials list (replaces oak/limestone draft): `Walnut · Book-matched marble · Fluted glass · Brushed brass · Linen · Hand-painted murals`

### 0.2 Reference-site details adopted (telhaclarke.com.au)

- Numbered section eyebrows: `01 — Approach`, `02 — Services`, …
- Bracketed micro-labels: `[ Scroll down ]` hero hint
- Loader: wordmark + `0–100` counter + location line
- Keyed footer rows (location / contact / social)
- Since photos are nearly all portrait: "full-bleed wide" moments use CSS `object-fit` crops of the widest frames (07190, 07204, 07246); elsewhere paired-portrait layouts.

---

## 1. Overview

A two-page portfolio doing two jobs at once: **present Nayan's work beautifully** and **make it effortless to get in touch**. There is one project so far, presented as a *flagship* — shown in depth on its own page — rather than faking a large portfolio. On a site this restrained, one project shown superbly reads as confident and intentional.

## 2. Site map

**Home (`index.html`)** — the studio pitch:
1. Preloader
2. Fixed nav
3. Hero (wordmark + thesis)
4. Intro (2–3 lines)
5. Approach (ethos / mission)
6. Services
7. Featured Project (teaser → links to Project page)
8. Contact (section)
9. Footer

**Project page (`project.html`)** — the flagship walkthrough:
1. Preloader-lite / entry transition
2. Fixed nav
3. Project hero (lead image + title + meta)
4. Project intro
5. Project facts block
6. Room-by-room sequence (with scroll-linked room index — the signature)
7. Materials & credits
8. Back-to-home / contact CTA
9. Footer

## 3. Tech stack & libraries

**Static site — HTML + CSS + vanilla JS.** No build step. Deploys anywhere.

Motion libraries (via CDN — these reproduce the reference feel):
- **Lenis** — smooth inertia scroll
- **GSAP** + **ScrollTrigger** — masked reveals, parallax, staggered entrances
- **SplitType** — split text into lines/words for masked text reveals
- Google Fonts — **Fraunces** + **Inter**

```html
<!-- in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Inter:wght@400;500&display=swap" rel="stylesheet">

<!-- before </body> -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script>
<script src="js/main.js"></script>
```

## 4. File structure

```
/
├── index.html            # Home
├── project.html          # Project page ("the product")
├── css/
│   └── styles.css
├── js/
│   └── main.js           # loader, Lenis, reveals, room index, cursor, transitions
├── assets/
│   ├── images/           # optimized webp/jpg + srcset sizes
│   └── favicon
└── README.md             # run + deploy notes
```

## 5. Design tokens

Define on `:root`; derive everything from these.

> **REVISED 2026-07-04 after first build review** — Akshay: the warm-plaster +
> serif version "looks like we made it with Claude". Inspected telhaclarke.com.au's
> actual shipped CSS: **one font only — Europa Grotesk No 2 Medium** (no serif),
> pure **white/black** palette, mist gray `#cacfcb` for inactive labels, single
> rust accent `#952c16`, display type up to 11–16rem. Tokens below now mirror that.

### Color
```css
--ink:        #101010;  /* black text on white */
--ink-soft:   #5A5A57;  /* secondary text, neutral gray */
--stone:      #B4B8B4;  /* mist — inactive labels (ref #cacfcb, darkened for a11y) */
--paper:      #FFFFFF;  /* pure white background, like the reference */
--paper-lift: #F5F5F3;  /* image placeholder / subtle surface */
--line:       rgba(0,0,0,0.12);
--accent:     #952C16;  /* rust, tiny states only (form errors) — from reference */
```

### Type
```css
--font-display: "Archivo", Helvetica, Arial, sans-serif;  /* everything */
--font-body:    "Archivo", Helvetica, Arial, sans-serif;
```
- **Single grotesque** everywhere, like the reference (Europa Grotesk №2 Medium).
  **Archivo** is the closest Google-Fonts stand-in. ~~Fraunces + Inter~~ dropped.
- Display set **big and tight**: weight 500, tracking `-0.02em`, line-height ≤1.05.
- Labels: UPPERCASE, letter-spacing `0.08em` (ref uses ~1px), 11–12px, weight 500.
- Reference copy tics kept: bracketed micro-labels `[ Scroll down ]`, numbered
  sections `01 Studio`, comma-separated nav items.

Fluid scale:
```
Hero thesis              clamp(2.6rem, 7.5vw, 8rem)     Archivo 500, lh 1.02
Section opener / big st. clamp(1.8rem, 4vw, 3.2rem)     Archivo 500
Body                     1.0rem / 1.6                   Archivo 400
Label / stamp            0.72rem UPPERCASE +0.08em      Archivo 500
```

### Space
- Section padding `clamp(5rem, 12vh, 10rem)` top/bottom.
- Text column max ~64ch; images go full-bleed or wide grid.
- Border-radius 0. Hairline rules only (`1px solid var(--line)`) — never boxes or shadows.

---

## 6. Animation & interaction spec

Restrained and orchestrated — this is the reference feel. **All motion gated behind `prefers-reduced-motion: reduce`** → content visible instantly, no transforms, Lenis off.

**6.1 Preloader (Home).** Full-screen `--paper` overlay, top z-index. Centered: wordmark (Fraunces) + a counter `00 → 100` (Inter, small). On `window.load` and a min ~1.2s: counter completes → wordmark fades → overlay wipes upward (`translateY(-100%)`, 0.9s `power4.inOut`) revealing the hero. Runs once per session (`sessionStorage` flag) so repeat visits aren't slow.

**6.2 Smooth scroll.** Lenis, `lerp: 0.1`. Drive ScrollTrigger from Lenis's scroll event and `gsap.ticker`. Disable entirely under reduced-motion.

**6.3 Hero entrance.** After the loader: thesis split into lines (SplitType), each line in an `overflow:hidden` mask, `translateY(110%) → 0`, stagger 0.08s, `power4.out`, ~1s. Hero image `scale(1.08) → 1` over 1.4s ease-out, simultaneously.

**6.4 Scroll image reveals.** Each image in an `overflow:hidden` mask. On enter (ScrollTrigger `start: "top 85%"`, once): clip reveal — `clip-path: inset(100% 0 0 0) → inset(0)` plus slight `y`, 1s `power3.out`.

**6.5 Image parallax.** Image sits ~115% of frame height inside its mask; ScrollTrigger `scrub` moves it `y: -7% → 7%` across its scroll range. Subtle.

**6.6 Section openers / eyebrows.** Eyebrow labels + Fraunces openers: SplitType lines, masked rise on enter, small stagger.

**6.7 Hover.** Text/nav links: underline draw (background-size 0→100% on a gradient underline, 0.4s). Project teaser + images: `scale(1) → 1.03`, 0.6s ease.

**6.8 Custom cursor (desktop, `pointer:fine` only).** Small lerped circle following the pointer; grows + shows a label ("View") over the project teaser and images. Hidden on touch and under reduced-motion.

**6.9 Room index (Project page, desktop).** Fixed ~120px margin column listing rooms in order; ScrollTrigger per room sets the active label (`--ink` active, `--stone` inactive). Click smooth-scrolls to the room. Appears only while the walkthrough is in view. Hidden on mobile.

**6.10 Page transition (Home ↔ Project).** On internal-link click, prevent default → slide a `--paper` overlay up over the viewport (0.6s) → navigate. New page's loader-lite starts covered and wipes away. If fiddly in multi-page, the per-page entrance animation alone is an acceptable fallback.

---

## 7. Website copy — all text

> Voice below is **studio voice** as default. If Nayan prefers **first person**, swap
> "Spaces by Nayan designs…" → "I design…", "we" → "I". Draft — refine wording later.

### 7.0 Global

**`<title>` (Home):** Spaces by Nayan — Interior Design Studio, Mumbai
**Meta description:** Mumbai interior design studio. Personal, practical, and timeless interiors, designed around how you live.

**Preloader:** `Spaces by Nayan` + counter `00–100`

**Nav (both pages):**
- Left: `Spaces by Nayan` (wordmark → Home)
- Right: `Work` · `Approach` · `Contact` (on Project page, `Work` → back to Home work section)

**Footer (both pages):**
```
Spaces by Nayan
Interior design studio · Mumbai

{{EMAIL}}
Instagram — @spacesbynayan

© 2026 Spaces by Nayan
```

### 7.1 Home page

**Hero**
- Wordmark: `Spaces by Nayan`
- Thesis `{{THESIS_LINE}}` — pick/adapt one (all drawn from Nayan's ethos):
  1. *Personal, intimate spaces — practical, comfortable, and made to last.*
  2. *Spaces designed around you, built to feel timeless.*
  3. *Interiors shaped by how you live — intimate, practical, timeless.*
- Small stamp under it: `INTERIOR DESIGN STUDIO · MUMBAI`

**Intro** (grounded in Nayan's ethos)
> Spaces by Nayan is a Mumbai interior design studio. Every space is designed around the person who lives in it — personal and intimate, shaped by the way you actually use a home. The result is practical and comfortable to live in, and quietly timeless: interiors that feel right on the first day and still feel right years later.

**Approach** (ethos / mission — Nayan's own point of view)
- Eyebrow: `APPROACH`
- Opener: *Designed around you.*
- Body:
> Good design starts with the client, not the trend. Nayan works closely with each person to understand how they live, then shapes a space that feels personal and intimate — never a showpiece you're afraid to touch. Every choice is made to be practical and comfortable for everyday life, and to stay timeless, so the space grows with you instead of dating.
- Three principles (as a spaced row / stacked list):
  - `01` Personal & intimate
  - `02` Practical & comfortable
  - `03` Made to last

*(Still optional to add later, if Nayan wants: her background/years and a short line about the kind of projects she wants more of.)*

**Services**
- Eyebrow: `SERVICES`
- Items (title + one line each):
  - **Full Interior Design** — Concept to completion: space planning, materials, joinery, lighting, and styling, managed end to end.
  - **Design Consultation** — A focused session for a single room or a second opinion — clear direction you can act on, without a full engagement.
  - **Renovation & Space Planning** — Rethinking how a space works before anything is bought — layout, flow, and light.
  - **Styling** — The final layer: furniture, textiles, and objects that make a finished space feel lived in.

**Featured Project** (teaser → `project.html`)
- Eyebrow: `SELECTED WORK`
- Title: `{{PROJECT_TITLE}}`
- Meta stamp: `{{PROJECT_TYPE}} · {{LOCATION}} · {{YEAR}}`
- Link label: `View project →`
- (Uses the lead project image; hover = scale + "View" cursor.)

**Contact** (section)
- Eyebrow: `CONTACT`
- Heading: *Have a space in mind?*
- Sub: Tell us a little about the project and we'll be in touch.
- Form fields: `Name` · `Email` · `Project type` (Home / Apartment / Commercial / Other) · `Message`
- Button: `Send enquiry`
- Success message: *Thanks — we'll be in touch shortly.*
- Beside the form: `{{EMAIL}}` · `@spacesbynayan` · `Working across Mumbai`

### 7.2 Project page (`project.html`)

**Project hero**
- Full-bleed lead image
- Title: `{{PROJECT_TITLE}}`
- Meta stamp: `{{PROJECT_TYPE}} · {{LOCATION}} · {{YEAR}}`

**Project intro** (draft — replace with real project facts)
> A {{PROJECT_TYPE}} in {{LOCATION}}, reworked around light and a warm, natural material palette. The brief was calm — a home that feels unhurried, where the materials do the talking and nothing competes for attention.

**Project facts block** (small stamps, two columns)
```
TYPE       {{PROJECT_TYPE}}
LOCATION   {{LOCATION}}
YEAR       {{YEAR}}
SCOPE      {{SCOPE}}
SERVICES   Full Interior Design
```

**Room-by-room sequence** (the walkthrough — numbered, since rooms are a real sequence)
> Replace these example rooms/captions with the actual rooms once photos are picked.
> Captions are short and factual — materials + room, never salesy.

```
01  Living      — Oak flooring, a honed stone hearth, linen in warm neutrals.
02  Kitchen     — Handleless oak joinery, honed stone counters, brushed brass.
03  Dining      — A single considered light over a solid timber table.
04  Bedroom     — Soft plaster walls, layered textiles, low warm light.
05  Bathroom    — Stone, matte fittings, and a quiet sense of ritual.
```
Layout rhythm (alternate to avoid monotony):
```
[ full-bleed room image ]
   01 Living — caption
[ portrait ]   [ portrait ]      ← paired detail shots
[ full-bleed wide ]
   02 Kitchen — caption
...
```
Each room is an anchor (`id="room-living"` …) wired to the room index (§6.9).

**Materials & credits**
- Eyebrow: `MATERIALS`
- List (replace with real): `Oak · Honed limestone · Brushed brass · Linen · Lime plaster`
- Credits (if any): `Photography — {{ }}` · `Styling — {{ }}`

**Close**
- Line: *Have a project like this in mind?*
- CTA: `Get in touch →` (scrolls to Home contact, or `index.html#contact`)
- `← Back to Spaces by Nayan`

---

## 8. Images — required optimization step

Source files are ~2.7MB PNGs. **Serving them as-is will make this design feel slow and broken** — and this style lives entirely on big images. Before wiring them in:

- Convert to **WebP** (AVIF too if easy), quality ~80; keep an optimized JPG fallback.
- Generate 2–3 widths each (≈800 / 1400 / 2000px); use `srcset` + `sizes`.
- Target: no image over ~250KB at 1400px width.
- `loading="lazy"` on everything below the hero; eager-load heroes.
- Real `alt` on every image describing the room/material (a11y + it's a portfolio).
- Set `width`/`height` or `aspect-ratio` to prevent layout shift.

```bash
# in the Codespace — example with sharp-cli
npx sharp-cli --input "assets/raw/*.png" --output "assets/images" \
  resize 1400 --format webp --quality 80
# repeat for 800 and 2000 widths
```

---

## 9. Step-by-step build instructions

Build and commit one phase at a time; each should render and be reviewable on its own.

**Phase 0 — Setup**
1. Create the file/folder structure in §4.
2. Add Google Fonts + CDN scripts (§3) to both `index.html` and `project.html`.
3. Write `README.md` with run (`npx serve .` or Live Server) + deploy notes.
4. Acceptance: both pages load blank with correct fonts available.

**Phase 1 — Tokens & base CSS**
1. Add `:root` tokens (§5), a reset, base typography, container widths, the type scale.
2. Add a temporary type-specimen block to verify Fraunces/Inter and the scale.
3. Acceptance: specimen shows correct faces, sizes, colors; remove specimen after.

**Phase 2 — Global shell**
1. Build the fixed nav and footer as shared markup on both pages (§7.0).
2. Add the preloader markup + styles (hidden state ready for JS).
3. Acceptance: nav is sticky, footer correct, layout stable at desktop + mobile widths.

**Phase 3 — Home content (static, no motion yet)**
1. Paste all Home copy from §7.1 into `index.html` sections in order (§2).
2. Style hero, intro, approach, services, featured-project teaser, contact.
3. Wire the contact form fields (validation only for now).
4. Acceptance: Home reads top-to-bottom correctly, responsive, no motion.

**Phase 4 — Project page content (static)**
1. Paste §7.2 copy into `project.html`; build hero, intro, facts, room sequence, materials, close.
2. Add room anchor IDs.
3. Acceptance: Project page reads as a clean walkthrough, responsive.

**Phase 5 — Motion core**
1. Init Lenis + GSAP/ScrollTrigger wiring in `main.js` (§6.2).
2. Preloader sequence (§6.1). Hero entrance (§6.3).
3. Scroll image reveals (§6.4) + section-opener reveals (§6.6) across both pages.
4. Acceptance: loader runs once/session; hero + images reveal smoothly; scroll feels weighted.

**Phase 6 — Signature + polish motion**
1. Room index on Project page (§6.9).
2. Image parallax (§6.5), hover states (§6.7), custom cursor (§6.8).
3. Page-transition wipe (§6.10).
4. Acceptance: room index tracks scroll + click; hovers/cursor feel intentional; transition is smooth.

**Phase 7 — Images**
1. Run the optimization pass (§8); place outputs in `assets/images`.
2. Wire `srcset`/`sizes`, lazy-load, alt text, aspect-ratios.
3. Acceptance: no image over budget; no layout shift; Lighthouse performance ≥ 90.

**Phase 8 — Contact wiring**
1. Connect the form to Formspree or Netlify Forms (or `mailto:` stopgap).
2. Success/error states per §7.1.
3. Acceptance: a test submission reaches the intended inbox.

**Phase 9 — QA & deploy**
1. Full pass on §10 quality floor: mobile (360px), keyboard focus, reduced-motion, semantics.
2. Cross-browser check. Run Lighthouse.
3. Deploy (GitHub Pages / Netlify / Vercel per hosting choice); connect custom domain if any.
4. Acceptance: live URL, all checks pass.

---

## 10. Quality floor (non-negotiable)

- Responsive to 360px width.
- Semantic HTML (`header main section figure figcaption footer`).
- Visible keyboard focus; logical tab order.
- Real `alt` on every image.
- `prefers-reduced-motion: reduce` fully respected (motion off, content visible).
- No layout shift on image load.
- Lighthouse: performance ≥ 90, accessibility ≥ 95.

---

### One-line brief for Claude Code
> Build a two-page, near-monochrome editorial portfolio for **Spaces by Nayan** (Mumbai interior design studio) in the quiet-luxury studio style (ref: telhaclarke.com.au): a Home page that sells the studio and a Project page presenting one flagship project as a scroll-linked, room-by-room walkthrough. Vanilla HTML/CSS/JS + Lenis + GSAP/ScrollTrigger + SplitType, Fraunces + Inter, warm-plaster palette with color only from photographs. Full motion treatment (preloader, masked reveals, parallax, custom cursor, page transitions). Optimize images per §8. Follow the phases in §9. All copy is in §7 — draft, to be refined.
