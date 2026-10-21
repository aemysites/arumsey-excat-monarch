# form

Custom **custom** block. Purpose: data-entry form (text inputs, radio/checkbox groups such as 'As proof of purchase/lease, I have enclosed one of the following (select one)', selects, submit) built from a form definition.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: a link to a sheet / JSON form definition (columns Field, Label, Type, Options, Mandatory, Placeholder, Value, Help, Style), plus optional key/value rows: Action (submission endpoint; defaults to the definition sheet), Confirmation (redirect URL), Message (success text), Error (failure text). Alternatively an inline definition table whose first row is the column header.

## Supported variations

No block variations. Field-level options (Style column, applied as classes on the field wrapper):

- `currency`: shows a `$` icon at the start of the input.
- `percent`: shows a `%` icon at the end of the input.

Repeated field sets are grouped automatically: when field names repeat with a numeric suffix
(`balance`, `apr` … then `balance-2`, `apr-2` …), each set is wrapped in a numbered `.form-group`
row (e.g. one row per debt in a calculator). The block renders inputs only; calculator logic is not
part of this block.

## Universal Editor fields

N/A (Document Authoring project)
