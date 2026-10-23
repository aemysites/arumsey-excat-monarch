# contact-form

Custom **custom** block. Purpose: contact/lead form built from authored field rows or a linked spreadsheet, with native validation and JSON POST submission.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: either a link to a form spreadsheet (.json with Label, Name, Type, Required/Mandatory, Options, Placeholder columns) or one row per field: cell 1 = label (trailing * = required), cell 2 = type (text, email, tel, number, url, date, textarea, select, checkbox, radio, hidden, submit; inferred from label when omitted), cell 3 = placeholder or comma-separated options. Config rows: Action | submit URL, Success | message, Error | message. Success/Error cells may be rich (image, heading, copy); rich success content replaces the form after submit. Select fields show their label as the in-field placeholder option. Submit stays disabled until required fields are valid and, for a list of optional checkboxes, at least one is ticked.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
