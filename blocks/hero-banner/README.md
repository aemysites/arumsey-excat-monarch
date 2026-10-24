# hero-banner

Custom **hero** block. Purpose: Page-top banner with a full-bleed photo (or colour) background, a main text box (heading, text, ticks, CTAs) and an optional side panel (offer, lifestage links, 'this page covers' contents).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: a picture-only cell is the background (with `logo`, it is a brand mark beside the copy); the first text cell is the main text box (heading, text, lists, CTA links); a second text cell becomes the side panel; further picture-only cells sit with the copy. Cells can be in one row or separate rows.

## Supported variations

| Variation | Option class |
| --- | --- |
| Text Box | `text-box` |
| Text Box 2 | `text-box-2` |
| Text Box 3 | `text-box-3` |
| Text Box Cyan | `text-box-cyan` |
| Offer Box | `offer-box` |
| Offer Box Cyan Light Image | `offer-box-cyan-light-image` |
| Link Panel | `link-panel` |
| Text Box Rounded | `text-box-rounded` |
| Text Box 4 | `text-box-4` |
| Logo | `logo` |
| Text Overlay | `text-overlay` |
| Promo Card | `promo-card` |
| Contents Panel | `contents-panel` |
| Tall (photo-only banner, 400px instead of 290px, photo anchored right top) | `tall` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- The background picture is loaded eagerly (LCP).
- Paragraphs made only of links become a side-by-side CTA row (`hero-banner-actions`).
