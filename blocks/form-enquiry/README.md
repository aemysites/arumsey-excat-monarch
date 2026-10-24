# form-enquiry

Custom **custom** block. Purpose: enquiry / complaint web form with optional help panel, built from authored config.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: content rows (heading, intro); config rows [form | action | submit | help | success | error | required note] [value]; field rows [label] [type: text, email, tel, number, date, url, textarea, select, radio, checkbox, heading, hidden] [options (comma list) or placeholder] [required: yes]. `form` may link to a form definition spreadsheet (.json: Name, Type, Label, Placeholder, Options, Mandatory, Value, Help). Submits JSON {data} via POST to `action`.

## Supported variations

| Variation | Option class |
| --- | --- |
| Alt | `alt` |

## Universal Editor fields

N/A (Document Authoring project)
