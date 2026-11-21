# Tiny Tot Montessori · notes for handover (v2.2)

Static site for **https://tinytot.lk**. It must be served from the root of a domain (Render static hosting does this): all paths start with `/`, so it won't work from a subfolder or from file://. Edit phone, WhatsApp, email and links in `js/config.js`.

## What changed in v2.2 (2026-11-21): search engines and AI
- **Real Sinhala page at `/si/`.** Before, Sinhala only appeared after JavaScript ran, so Google, Bing and AI crawlers saw English only. Now `/si/` is a complete Sinhala HTML page. The EN / සිං switch is a pair of real links (`/` and `/si/`). With JavaScript it still switches in place, keeping the reader's spot, and the address changes to `/` or `/si/`. Someone who chose Sinhala before is sent to `/si/` when they open `/`. Old `?lang=si` links also go to `/si/`.
- **`si/index.html` and `js/i18n-en.js` are generated.** Don't edit them by hand. After changing text in `index.html` or `js/i18n-si.js`, run `build_si.py` from `../tiny-tot-montessori-tools/` (kept outside the site folder, so it isn't uploaded).
- **Head tags:** canonical address, `hreflang` links between the two languages, `og:url`, `og:locale`, an absolute share image (`https://tinytot.lk/media/share.jpg`), and Sinhala title and description on `/si/`. Structured data now has `url`, `logo` and `image`.
- **`robots.txt`** (allows everything, points to the sitemap) and **`sitemap.xml`** (both pages with language alternates).
- **After uploading to Render:** add `tinytot.lk` to Google Search Console as a Domain property (verify with the TXT record in Cloudflare DNS), submit `https://tinytot.lk/sitemap.xml`, and use URL Inspection on `/` and `/si/` → Request indexing. Then Bing Webmaster Tools → Import from Google Search Console. Also claim or update the school's **Google Business Profile** with the website `https://tinytot.lk`; for local searches that matters more than anything on the page.
- The review stars in structured data will probably not show in Google results (Google ignores a business rating it publishes about itself). They're harmless.

## What changed in v2.1 (2026-11-15)
- **Sinhala version.** An EN / සිං switch in the nav and the menu. English is the default. Switching keeps the reader at the same spot on the page, remembers the choice for next time, and adds `?lang=si` to the address so a Sinhala link can be shared. All text, buttons, form labels, image descriptions and the WhatsApp/email message switch language. Sinhala text lives in `js/i18n-si.js`; English stays in `index.html`. Font: Noto Sans Sinhala (self-hosted, `fonts/noto-sinhala.woff2`, SIL Open Font License).
- **The Sinhala is my draft translation.** A native speaker at the school should read `js/i18n-si.js` once before launch. The two Google reviews are translated and marked "(පරිවර්තනය)".
- **3D crest:** the top bar is now two separate T tops with a gap in the middle, matching the real logo (T T M).
- **WhatsApp:** the form and the WhatsApp button now send to +94 76 567 2424 (`whatsapp` in `js/config.js`). The call buttons still show 071 151 3550 and 076 567 2424.

## What changed in v2
- New design system "Toybox" (see DESIGN.md), inspired by the two Framer sites the client shared.
- **Daycare removed everywhere:** text, meta, structured data, the enquiry message, and the photos. The street-wall photo and the lamp-night photo were cropped so "AND DAYCARE CENTER" is no longer visible. The originals are not in the site folder.
- New "golden ticket" enrolment with a stamp and confetti before WhatsApp opens.
- 3D toys rendered in three.js: pink tower, ring stacker, letter blocks (T, ට, M), gold star, crayon (`media/toy-*.webp`).
- Higgsfield had only 0.75 credits left (one image costs 1), so nothing was generated there.

## Facts used and where they came from
| Fact | Source |
|---|---|
| Name, Montessori preschool | Google Maps category, painted front wall |
| Baddegama Rd, Gonapinuwala 80230, Galle | Google Maps, Facebook |
| +94 71 151 3550 | Google Maps |
| 076 567 2424 · 71tinytot@gmail.com | Facebook About |
| Since 2002, "well trained teachers", the promise quote | Facebook About text |
| 4.8 stars, 20 reviews, review tags, 2 quoted reviews (Shashika W., Poorni N.) | Google Maps (screenshots) |
| Hours Mon–Fri 8 am–1 pm, weekends closed | Google Maps shows Friday 8–1 and "opens 8 am Mon"; other weekdays assumed the same |

## Must confirm with the school
- That dropping "daycare" is right for them (the wall still says it, so parents may ask).
- Weekday hours other than Friday (shown in the hero chip, stats, and visit card).
- "Sinhala and English from day one": inferred from the Sinhala letter mural and English alphabet wall in the photos.
- The lamp-night photo is captioned "Lamp night"; give the real occasion if they want it named.
- Age range: the form asks for the child's age as free text; no ages are claimed on the site. Fees and staff names are not on the site at all. Nothing was invented.

## Permissions (important)
- Three photos (teachers, fairies, marching band) carry a ShutterTime / Yesith Bimsara De Silva watermark saying they may not be reproduced without permission. The watermark bar was cropped and the photographer is credited. The school must confirm permission for web use, or swap these photos.
- The school film is by Sampath Video (credited). The 75 s cut keeps the film's soundtrack; confirm the music is cleared for web use.
- Children appear in most photos and the film. The school should be comfortable that parents agreed to web use.

## Media
- `media/hero-720.mp4` / `hero-480.mp4`: 20 s silent loop from the film. `media/film-75s.mp4`: first 75 s with sound, opens in the lightbox.
- Stills `v-*.webp` come from the film. Event photos are the school's own.
- 3D crest (`js/crest.js`) is built in three.js from the logo; toys are pre-rendered in three.js to transparent WebP so phones don't run extra WebGL.

## Not done yet
- A native speaker at the school should still read the Sinhala (`js/i18n-si.js`), then rebuild `/si/`.

## Testing done
v2.2: click-test of `/` and `/si/` at 390, 820, 1024, 1440 and 1920 px; switching on both pages keeps the same content in view (0–35 px); the address changes between `/` and `/si/`; a returning Sinhala reader and old `?lang=si` links land on `/si/`; with JavaScript off, `/si/` is fully Sinhala and the switch links work; no missing files and no console errors on either page.

v2.1: both languages click-tested at 390, 820, 1024, 1440 and 1920 px (same checks as below), plus switching languages mid-page at five sections keeps the same content in view, reloading keeps Sinhala, and the WhatsApp message is built in the chosen language.

Playwright click-test at 390, 820, 1024, 1440 and 1920 px: no horizontal overflow, no invisible click blockers (only elements mid-reveal at the bottom edge), menu sheet and nav links scroll to sections, hero pause, film opens and closes from the hero and the film band, card arrows, review stamp arrows, crest drag, map loads, form validates, stamp lands and the WhatsApp message is built, no "daycare" anywhere in the page, mobile dock appears. No console errors.
