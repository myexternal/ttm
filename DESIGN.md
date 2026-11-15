# Tiny Tot Montessori · design system "Toybox" (v2)

v2 replaces v1 "Plinth" (kept as `../tiny-tot-montessori-v1.zip`). This system belongs to Tiny Tot only. It shares no skeleton, fonts or palette with Hewad Market, Flavours of Asia, Nupelda, Ceylon Tampere CC, Inex or Averox.

References the client pointed to: kidocare.framer.website and kiddoz.framer.website. Borrowed ideas, not layouts: warm cream ground, rotated sticker tags on a giant headline, organic photo shapes, tinted cards, a centred statement with round inline photos, and scalloped edges.

## Idea
A Montessori classroom shelf: real wooden toys, bright tints, everything at child height. The 3D toys (pink tower, ring stacker, letter blocks T · ට · M, gold star, crayon) are rendered in three.js and float around the page. The enrolment form is a **golden ticket** that gets stamped "Seat requested" with confetti.

## Colour
| Token | Hex | Use |
|---|---|---|
| `--cream` | #FFF7EA | page |
| `--cream-2` | #FCEDD5 | learning band |
| `--ink` | #24195E | crest monogram indigo: all text |
| `--night` | #1A1146 | story, admissions, footer |
| `--magenta` | #D9147A | wordmark magenta: every primary CTA |
| `--sun` | #FFC93C | the golden ticket, film play button, highlights on dark |
| `--leaf` | #5FA82A | laurel, ticks, "open" dot |
| `--fence` | #E03B2B | "red letters" and the stamp |
| tints | pink / sky / sun / green / lilac | learning cards, review tags |

## Type
**Bricolage Grotesque** (self-hosted variable, 200–800), used at its extremes: 200 for the voice, 800 for the emphasis, mixed inside each headline ("Little hands, **big beginnings.**"). Hero 54–168px at -0.055em. Section heads 38–84px. Body 17px. Sinhala: Noto Sans Sinhala (100–900), also used at its extremes. In Sinhala mode headings shrink about 20%, line height opens up (1.18–1.5) and letter spacing goes back to 0, because tight tracking breaks Sinhala joins.

## Hierarchy and layout (each section a different layout)
1. **Hero:** floating pill nav, centred giant headline with 3 rotated stickers, two CTAs ("Claim a seat for your child" is primary), then the school film in a big rounded frame with a review card and "Open weekdays" chip. 3D tower and stacker float either side with parallax; blocks sit on the frame's corner.
2. **Stats:** one white strip, 4 cells with dashed dividers, numbers in 4 brand colours.
3. **About:** centred statement with three pill-shaped inline photos, then a blob-masked photo (with crayon) beside copy and 4 tick chips.
4. **Learning:** scalloped band, horizontal snap carousel of 6 tinted cards with arched photos, arrow buttons on desktop.
5. **Film:** wide rounded poster, big pulsing yellow play button, opens the 75 s film.
6. **Our year:** taped polaroid wall (3 per row, random tilt); swipe row on phone.
7. **Story:** dark scalloped band, the school's promise quote and the draggable 3D crest.
8. **Teachers:** big photo, perforated postage-stamp review card with 2 Google reviews, rating pill and review-tag chips.
9. **Admissions (the winning CTA):** dark starry band, "Your child's **golden ticket**", a ticket with notched perforation: form on the left, yellow stub with 3D gold star and "Claim this seat" button on the right.
10. **Visit:** wall photo, facts card, click-to-load map.
11. **Footer:** "Ready for the first day?" CTA, giant two-weight wordmark, Sinhala name.

## The win moment
Claim → fields validate → the ticket gives a small thump, a red double-border "SEAT REQUESTED ✓" stamp springs down from 2.4× scale, 150 pieces of confetti burst from the button in crest colours, the button text becomes "Seat requested ✓" and WhatsApp opens with the message ready. Email works the same way.

## Motion (emil-design-eng / apple-design / improve-animations)
- Easing: `--ease-out cubic-bezier(.23,1,.32,1)`, `--ease-drawer cubic-bezier(.32,.72,0,1)`, `--spring cubic-bezier(.34,1.56,.64,1)` (stickers, stamp, polaroids).
- Hero: text rises in sequence, stickers and cards pop with a spring. Toys bob slowly and drift with scroll.
- Press feedback: buttons scale to .97 in 160ms. Hover only behind `(hover:hover) and (pointer:fine)`.
- Reveals: opacity + 26px rise, staggered; the delay is removed after reveal so hover is instant.
- Reduced motion: no bobbing, parallax, confetti or springs; the hero film starts paused; content shows with opacity only.

## Mobile (mobile-native)
`viewport-fit=cover`, safe areas on nav, sheet, dock and footer, 16px inputs, no tap highlight, `touch-action: manipulation`, swipe rows for cards and polaroids, ticket stacks vertically with side notches, bottom dock (Call / WhatsApp / Claim a seat) after the hero.
