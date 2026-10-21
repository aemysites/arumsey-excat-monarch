# rating-summary

Custom **custom** block. Purpose: Zillow lender rating summary: live score, star fill, review count and "as of" date from a server-side proxy, next to authored Zillow attribution.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional config row "endpoint" | proxy URL (link or text); optional config row "reviews" | link to the Zillow reviews page; one content row: cell 1 = "How this rating is calculated" link, cell 2 = Zillow logo + copyright line with Terms of Use link. Do NOT author the score, review count or date: they come from the feed. Config rows are removed from the rendered DOM.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)

## Live data (Zillow feed)

The score, star fill, review count and "as of" date are **not authored**. The block fetches them from a server-side proxy that holds the Zillow partner key. Never put a key in the page or the block.

Endpoint lookup order:

1. Authored config row: `endpoint` (or `feed`, `feed-url`, `source`) | proxy URL (link or plain text)
2. Page metadata `zillow-rating-endpoint`
3. `/placeholders.json` key `Zillow Rating Endpoint` (`zillowRatingEndpoint`)

Optional config row: `reviews` | link to the Zillow reviews page (used when the feed sends no `reviewsUrl`). Config rows are removed from the rendered DOM.

Expected response:

```json
{ "rating": 4.85, "reviewCount": 4474, "asOf": "2026-10-20", "scale": 5, "reviewsUrl": "https://www.zillow.com/..." }
```

`scale` and `reviewsUrl` are optional. `rating` must be between 0 and `scale`, `reviewCount` must be a non-negative integer, and `asOf` must be an ISO date. If no endpoint is set, the request fails or times out (8 s), or the data is malformed, the score row stays hidden (`rating-summary-unavailable`) and the static parts still show.

Still open: the proxy host, Zillow credentials, and response caching.
