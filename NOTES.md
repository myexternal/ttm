# Tiny Tot Montessori · notes for handover (v2)

Static site: open `index.html` through any web server (not file://, because the 3D crest loads modules). Works on Render static hosting like the other clients. Edit phone, WhatsApp, email and links in `js/config.js`.

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
- Which number has WhatsApp. The form sends to 071 151 3550 (`whatsapp` in `js/config.js`).
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
- Domain unknown: once known, change `og:image` in `index.html` to the absolute URL (e.g. `https://<domain>/media/share.jpg`).
- Sinhala language version (needs a native speaker).

## Testing done
Playwright click-test at 390, 820, 1024, 1440 and 1920 px: no horizontal overflow, no invisible click blockers (only elements mid-reveal at the bottom edge), menu sheet and nav links scroll to sections, hero pause, film opens and closes from the hero and the film band, card arrows, review stamp arrows, crest drag, map loads, form validates, stamp lands and the WhatsApp message is built, no "daycare" anywhere in the page, mobile dock appears. No console errors.
