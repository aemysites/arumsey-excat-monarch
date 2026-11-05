# share-bar

Custom block (no library base). Purpose: slim bar under an article or news title: the title on the left and round social share buttons (LinkedIn, Facebook, X) on the right.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1 = title heading (optional; omitted rows render only the share buttons); optional row 2 = which networks to show, as links or a comma list (linkedin, facebook, x, email). Without row 2 it shows LinkedIn, Facebook and X. Share URLs are built from the current page URL, not the authored links. Icons are inline SVGs built by the block (no /icons/ files needed).

## Supported variations

| Variation | Option class |
| --- | --- |
| Red Light | `red-light` |
| Label (job postings) | `label` (added automatically when the title is not the page title, e.g. "Share this job": label above small navy filled icons, right aligned) |

## Universal Editor fields

N/A (Document Authoring project)
