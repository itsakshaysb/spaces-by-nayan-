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

## Deploy (no GitHub Pages)

The live site should **not** be served from github.io. Package only the public
files, then upload that folder to a host. Keep Google Workspace for email.

```bash
bash scripts/package-site.sh
```

That writes `dist/` (`index.html`, `project.html`, `css/`, `js/`, `assets/`).
Do not upload `DESIGN.md`, `README.md`, or `Nayan/`.

**Recommended — Netlify Drop (no GitHub connection):**

1. Open [app.netlify.com/drop](https://app.netlify.com/drop) and sign in.
2. Drag the `dist/` folder onto the page.
3. Site settings → Domain management → add `www.spacesbynayan.com` (or your domain).
4. At your DNS (same place as Google Workspace):
   - Leave **MX** records on Google (email).
   - **CNAME** `www` → the Netlify hostname (e.g. `something.netlify.app`).
   - Follow Netlify’s instructions for the bare domain (`spacesbynayan.com`).
5. In GitHub: Settings → Pages → **Unpublish** so `*.github.io` goes away.

**Google alternative — Firebase Hosting:**

```bash
bash scripts/package-site.sh
npx firebase-tools login
npx firebase-tools hosting:sites:create spaces-by-nayan
npx firebase-tools deploy --only hosting
```

Then attach the same custom domain in the Firebase console. Workspace email MX records stay as they are.

## Accessibility & motion

All animation is gated behind `prefers-reduced-motion: reduce` — with it set,
content renders instantly with no smooth scroll or transforms. The preloader
runs once per session (`sessionStorage`).
