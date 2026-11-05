# form

Custom block (no library base). Purpose: Contact, consultation, sponsorship, newsletter and gated-content forms with optional intro copy or advisor profiles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Any number of intro rows (heading, text, lists, advisor photos/contacts; each cell becomes an intro part) plus one row whose only content is a link to the form source. A link to a .json spreadsheet (columns Name, Label, Type, Placeholder, Mandatory, Options, Value; Type text/email/tel/number/date/textarea/select/checkbox/radio/hidden/heading/plaintext/submit) renders a native form that POSTs {data} to the sheet path; any other link (Moosend, Dynamics or other hosted form) is embedded in an iframe.

## Supported variations

| Variation | Option class |
| --- | --- |
| Text Left | `text-left` |
| Dark | `dark` |
| Boxed | `boxed` |
| Boxed 2 | `boxed-2` |
| Boxed 3 | `boxed-3` |

## Universal Editor fields

N/A (Document Authoring project)
