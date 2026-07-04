# Spaces by Nayan — Portfolio

Two-page, image-forward portfolio for **Spaces by Nayan**, a Mumbai interior
design studio. Static HTML/CSS/vanilla JS with Lenis + GSAP/ScrollTrigger +
SplitType (all via CDN — no build step). See `DESIGN.md` for the full spec
and locked decisions.

## Run locally

```bash
npx serve .
# or use the VS Code "Live Server" extension
```

Then open the printed URL (usually http://localhost:3000).

## Pages

- `index.html` — Home: hero, intro, approach, services, featured project, contact
- `project.html` — Flagship project: "A Mumbai Apartment", six-room walkthrough
  with a scroll-linked room index (desktop)

## Before going live — fill these in

| What | Where |
|---|---|
| Real email address | Replace `hello@spacesbynayan.example` in both HTML files and `CONTACT_EMAIL` in `js/main.js` |
| Formspree form ID | Set `FORM_ENDPOINT` in `js/main.js` (until then the form opens the visitor's mail client) |
| Project year & scope | Facts block in `project.html` (YEAR row currently omitted) |
| Photographer credit | `{{PHOTOGRAPHER}}` in `project.html` materials section |

## Images

Optimized derivatives live in `assets/images/` (WebP at 800/1400/2000 px +
JPG 1400 px fallback, generated with Pillow at quality ~80). Raw photos stay
in `drive-download-*/` which is gitignored. The entrance photos (DSC07443-*)
are deliberately unused — the client's family name is visible on the door sign
and the project is published anonymously.

## Deploy

Any static host works: GitHub Pages, Netlify, or Vercel — no server code.
If GitHub Pages is chosen, pair the contact form with Formspree (Netlify Forms
only works on Netlify).

## Accessibility & motion

All animation is gated behind `prefers-reduced-motion: reduce` — with it set,
content renders instantly with no smooth scroll or transforms. The preloader
runs once per session (`sessionStorage`).
