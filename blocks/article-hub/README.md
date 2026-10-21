# article-hub

Custom block. Purpose: article hub landing page (citi.com learning center / travel guide): photo banner with a title card and article search, then light-blue bands of article cards with "View all" links, an optional link-list box and a blue resource-tile band, then an optional closing note.

## Authoring (Document Authoring)

Model: `standalone`

Single block table, one row per item, in order:

- Row 1 (hero): image cell | text cell (optional eyebrow, H1, description, optional `Search ...` paragraph used as the search field label).
- Optional search row: `Search` | label text.
- Heading row (one cell: heading + optional "View all" link) starts a group. A group whose heading has a link is a category group.
- Card rows: image cell | text cell (title with link, description). Card rows without an image render as resource tiles (blue band).
- A one-cell row with a list right after a heading: link-list box (e.g. "Other categories").
- Any other one-cell row: closing note.

## Behaviour

- Search filters every card on the page by its text (no pagination) and shows a "Showing N results" heading.
- Category groups show their first 4 cards; categories after the third are revealed by a generated "View All Categories" button.
- Images whose import failed (`blob:` URLs) keep an empty image slot.

## Generated classes

`article-hub-hero`, `-hero-card`, `-eyebrow`, `-title`, `-description` (after an eyebrowed title) / `-caption` (otherwise), `-search`, `-groups`, `-group` (+ `-group-category`, `-group-links`, `-group-resources`), `-cards`, `-card`, `-more`, `-footer`.

## Supported variations

No variations.
