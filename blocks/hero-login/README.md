# hero-login

Custom **hero** block. Purpose: home / landing hero with an offer (eyebrow, heading, copy, CTA), an optional product image and a sign-on panel (User ID, Password, Remember me, Sign On, register and forgot links, passwordless sign-on).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional picture-only rows (with two, the first is the background and the second the product image; with one, it is the product image, or the background for text-box-and-sign-on-panel); one copy cell (eyebrow, heading, text, CTA); one sign-on cell whose plain paragraphs are field labels (User ID, Password, Remember User ID), an optional heading, an optional plain list for an account-type select, a 'Sign On' link (becomes the submit button) and helper links (Register / Activate, Forgot, Passwordless Sign On). A cell holding only a link to a /fragments/ page is replaced by that fragment.

## Supported variations

| Variation | Option class |
| --- | --- |
| Text Box And Sign On Panel | `text-box-and-sign-on-panel` |

## Universal Editor fields

N/A (Document Authoring project)
