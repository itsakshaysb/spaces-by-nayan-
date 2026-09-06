# Spaces by Nayan — Portfolio

Two-page, image-forward portfolio for **Spaces by Nayan**, a Thane interior
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
- `project.html` — Flagship project: "A Thane Apartment", six-room walkthrough
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

## Deploy — `spacesbynayan.com` (free hosting)

You already own **spacesbynayan.com**. Nameservers are Google; **email already
works** (`MX` → `smtp.google.com`). The web records currently point at
**Squarespace**. Hosting this HTML site can be **$0**; you only keep paying for
the domain + Google Workspace. Do not use Google Sites or GitHub Pages.

```bash
bash scripts/package-site.sh
```

That writes `dist/` (`index.html`, `project.html`, `css/`, `js/`, `assets/`).
Do not upload `DESIGN.md`, `README.md`, or `Nayan/`.

**Recommended free host — Cloudflare Pages** (custom domain + HTTPS, enough
bandwidth for photos; no GitHub connection):

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free plan).
2. Workers & Pages → Create → **Upload assets** → drop the `dist/` folder.
3. Custom domains → add `www.spacesbynayan.com` and `spacesbynayan.com`.
4. In Google/Squarespace DNS for this domain, **change only the website
   records**. Cloudflare will show the exact values. Typical pattern:
   - **Leave MX** `smtp.google.com` (Workspace email).
   - **Leave TXT** SPF `v=spf1 include:_spf.google.com ~all`.
   - **Replace** the Squarespace `www` CNAME (`ext-sq.squarespace.com`) with
     the CNAME Cloudflare gives you (`….pages.dev`).
   - **Replace** the Squarespace A records on `@` with Cloudflare’s A/AAAA
     (or CNAME flattening) for the apex.
5. Wait for HTTPS. Then unpublish GitHub Pages so github.io is gone.

**Also free — Netlify Drop:** [app.netlify.com/drop](https://app.netlify.com/drop)
→ drag `dist/` → Domain management → `spacesbynayan.com`. Same DNS rule: only
swap Squarespace web records; do not touch MX.

**Skip Firebase’s free Spark plan** for this site. Photo pages can exceed the
~360 MB/day cap. Cloudflare or Netlify free tiers are the right fit.

## Accessibility & motion

All animation is gated behind `prefers-reduced-motion: reduce` — with it set,
content renders instantly with no smooth scroll or transforms. The preloader
runs once per session (`sessionStorage`).
