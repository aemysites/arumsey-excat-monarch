# listing

Custom block (no library base). Purpose: searchable, filterable list of site pages (people directory, insights directory, community events, career opportunities), read from the site's page index.

## Authoring (Document Authoring)

Model: `standalone`

Single block table with a variant, then key / value rows (all optional):

| Listing (people) | |
| --- | --- |
| Source | /query-index.json |
| Path | /en/personnel/ |
| Filters | region, office |
| Page size | 20 |
| Sort | title |
| Heading | Personnel |

- **Source**: index to read (default `/query-index.json`).
- **Path**: only pages directly under this path are listed (`/en/personnel/<name>`, not deeper pages; the listing page itself is excluded).
- **Filters**: index fields shown as dropdowns; values come from the indexed pages (comma-separated values count separately).
- **Page size**: results per "Load more" step.
- **Sort**: index field; prefix with `-` for descending (e.g. `-published`).
- **Heading**: optional heading; it leads the filter panel (opened with the "Filter by" button), or, when the listing has no filters, sits above the results for screen readers only.

The controls follow the source search pages: "Displaying results for:" with the results count beside the search field, the A–Z row (people, events), and a "Filter by" button that opens the filter dropdowns (open on load when the URL already sets a filter). Cards show a type icon (`icons/event.svg` for events and webinars, `icons/insight.svg` otherwise).

Search text, the A–Z letter (people, events) and filters are kept in the page URL (`?q=`, `?letter=`, `?<field>=`), so a link such as `/en/insights/directory?insight=Insight&theme=Agility` opens the directory pre-filtered (insight pages link their tags this way).

## Supported variations

| Variation | Option class | Card | Default filters / sort |
| --- | --- | --- | --- |
| People | `people` | portrait, name, role, office, phone, email; A–Z by last name | region, office / title |
| Insights | `insights` | image, type, date, title, summary | insight, theme, service / -published |
| Events | `events` | image, "Community Event" label, date, title, summary; A–Z by title | none / -published |
| Jobs | `jobs` | title, company, location | region / title |

## Index fields

The block reads these columns (missing columns simply hide the matching card line or filter): `path`, `title`, `description`, `image`, `type`, `date`, `published` (unix seconds), `role`, `office`, `region`, `phone`, `email`, `company`, `location`, `insight`, `theme`, `service`.

The default Edge Delivery index provides `path`, `title`, `description`, `image`, `lastModified`. The other fields need properties in the site's index configuration (managed in the site config on tools.aem.live), extracted from the published pages, for example:

```yaml
indices:
  default:
    include: ['/en/**']
    target: /query-index.json
    properties:
      title: { select: 'main h1, main .columns-profile h2', value: 'textContent(el)' }
      description: { select: 'head > meta[name="description"]', value: 'attribute(el, "content")' }
      image: { select: 'head > meta[property="og:image"]', value: 'match(attribute(el, "content"), "https:\/\/[^/]+(\/.*)")' }
      date: { select: 'main .hero-page p', value: 'textContent(el)' }
      role: { select: 'main .columns-profile > div > div:last-child > p', value: 'textContent(el)' }
      office: { select: 'main .columns-profile a[href^="/en/offices/"]', value: 'textContent(el)' }
      phone: { select: 'main .columns-profile a[href^="tel:"]', value: 'attribute(el, "href")' }
      email: { select: 'main .columns-profile a[href^="mailto:"]', value: 'attribute(el, "href")' }
      location: { select: 'main .job-details > div > div:first-child', value: 'textContent(el)' }
      company: { select: 'main .columns-sidebar h3', value: 'textContent(el)' }
```

For the local preview, `migration-work/site/build-query-index.cjs` generates `content/query-index.json` with all fields from the imported pages.

## Universal Editor fields

N/A (Document Authoring project)
