# tabs-feature

Custom **tabs** block. Purpose: Tabbed feature panels: icon tiles or text tabs, each revealing a content panel; complex panels load from a fragment.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per tab: cell 1 = tab label (optional icon/picture + text), cell 2 = panel content, or a single link to a fragment (/fragments/...) when the panel contains other blocks.

## Supported variations

| Variation | Option class |
| --- | --- |
| Text Tabs On Band | `text-tabs-on-band` |
| Underlined Text Tabs | `underlined-text-tabs` |
| Icon Tiles | `icon-tiles` |
| Icon Tiles 2 | `icon-tiles-2` |
| Underlined Text Tabs 2 | `underlined-text-tabs-2` |
| Underlined Text Tabs 3 | `underlined-text-tabs-3` |

## Universal Editor fields

N/A (Document Authoring project)

## Fragment panels

A panel that contains other blocks goes in a fragment. Put a single link to it in the panel cell, for example `/fragments/small-business/what-to-bring/bank-accounts`. The block loads it with `loadFragment`. The link counts as a fragment when the cell holds only that link and its path contains `/fragments/` or its text is the URL. If the fragment can't be loaded, the link stays visible.
