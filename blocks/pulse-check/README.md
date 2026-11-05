# pulse-check

Custom block (no library base). Purpose: Multi-step self-assessment questionnaire (rating statements, then contact details) with step tabs and Previous / Next / Finish navigation.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One row per step: cell 1 step title (e.g. 'Instructions:', 'Information'); cell 2 intro copy plus a numbered list whose items become rating statements, and/or a link to a .json field sheet (Name, Label, Type, Mandatory, Options, Value) for the contact step; optional cell 3 right-rail image. Optional config rows keyed by the first cell: 'Scale' (comma-separated answer labels, first scores highest; default Strongly agree..Strongly disagree), 'Submit' (link to the endpoint answers are POSTed to as {data}), 'Results' (content shown after Finish, with {score} and {max} placeholders).

## Supported variations

| Variation | Option class |
| --- | --- |
| Cyan | `cyan` |

## Universal Editor fields

N/A (Document Authoring project)
