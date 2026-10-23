# article-feedback

Custom **custom** block. Purpose: 'Was this article helpful?' prompt with two feedback buttons (thumbs up / thumbs down) at the end of resource articles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1: the question (text or heading); row 2: one cell per answer option, each with its label and an optional icon (e.g. :thumbs-up: / :thumbs-down: icons or images). The question and options may also share one row (question in the first cell). Optional row 3: thank-you message shown after answering (defaults to 'Thanks for your feedback!').

## Supported variations

Expat (automatic): on pages with Metadata "Template: expat-article" the block gets the `expat` class: divider above, left-aligned 24px question, equal-height vote buttons, aligned with the article-body expat column from 992px and on one row from 1200px. The class can also be authored as a block variant.

## Universal Editor fields

N/A (Document Authoring project)
