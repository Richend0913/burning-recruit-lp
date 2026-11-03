# Task: RECRUIT LP — mobile hero deviation fix (CSS only)

Repo: ~/workspace/projects/burning-recruit-lp (Astro, production branch master)
File to edit: **src/components/Hero.astro — ONLY the `<style>` block. No markup changes, no text changes, no other files.**

## Background
The mobile (SP, <860px) hero currently renders: eyebrow + H1 on white background → full-bleed photo block → lead paragraph → CTA buttons → checklist. The approved dedicated mobile design comp instead has a photo-led hero: the full-bleed driver photo comes first and the eyebrow + H1 are OVERLAID on the photo's upper area (bright sky side), with the lead/CTAs/checklist following below the photo.

Implement that overlay composition for SP only, by APPENDING one new media block at the end of the existing `<style>` in Hero.astro:

```css
@media (max-width: 859.98px) { ... }
```

Do not modify any existing rules; the desktop (≥860px) rendering must remain byte-for-byte equivalent in layout. All new rules live inside this max-width block so nothing leaks to desktop.

## Required changes inside the media block

1. `.hero` — `padding-block-start: 0` (photo starts directly under the sticky header).
2. `.hero-grid` — switch to `display: grid; grid-template-columns: minmax(0, 1fr);` (`.hero-main` already has `display: contents`, so eyebrow/title/sub/btns/checks are grid items).
3. `.hero-photo` — place in the same cell as the text: `grid-area: 1 / 1; position: relative; margin-block-start: 0;` (keep the existing `margin-inline: -20px` full bleed from the base rule). Taller crop: `aspect-ratio: 4 / 4.7; min-height: 470px;` Keep `object-position: 72% 40%` on the img for now.
4. Scrim for legibility: `.hero-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.82) 34%, rgba(255,255,255,0.38) 62%, rgba(255,255,255,0) 82%); pointer-events: none; }`
5. `.hero-eyebrow` — overlay: `grid-area: 1 / 1; align-self: start; position: relative; z-index: 2; margin-block-start: 22px;`
6. `.hero-title` — overlay: `grid-area: 1 / 1; align-self: start; position: relative; z-index: 2; margin-block-start: 59px;` Do NOT change its font-size (34px stays; the real 4-line headline must not re-wrap).
7. `.hero-sub` — add breathing room below the photo: `margin-block-start: 24px;`
8. Sub/buttons/checks must keep their current order and appearance (grid auto-placement should put them in rows 2/3/4 — verify).

## Hard constraints
- No text, markup, href, price, or other-file changes. `git diff` must show changes only inside the `<style>` of src/components/Hero.astro.
- Desktop ≥860px must be visually unchanged.
- After editing, run `npm run build` and confirm it succeeds.

Report: the exact CSS you added and the build result. Do not commit or push.
