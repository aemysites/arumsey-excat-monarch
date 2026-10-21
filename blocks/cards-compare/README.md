# cards-compare

Custom **cards** block. Purpose: Side-by-side product comparison cards with a title header band, labelled detail sections with check-mark lists, and CTAs pinned to the bottom.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per card: title heading (optionally with an icon image beside it), then description, label + check-list sections separated by horizontal rules or separate cells, and closing link-only paragraphs that become the bottom CTAs.

- An image next to the title is shown as a 32px icon at the right of the title band; a wide image (aspect ratio above 2.5:1) fills the band as its background. Without an image the band uses the Citi header artwork in `header-bg-1..4.png` (light, mid, dark, blue, repeating).
- A bold-only paragraph followed by more content is an eyebrow label ("Best for", "Loan details"). A bold link at the end becomes a full-width primary button; a plain link becomes a chevron text link. A trailing bold-only paragraph with no link is shown as a button label (citi.com uses JS buttons there, so the link may be missing from imported content).
- Matching sections line up across cards (CSS subgrid from 600px up).

## Supported variations

| Variation | Option class |
| --- | --- |
| Shadow | `shadow` |
| Shadow Blue | `shadow-blue` |
| Coloured Top Bar | `coloured-top-bar` |
| With Icon Header | `with-icon-header` |

## Universal Editor fields

N/A (Document Authoring project)
