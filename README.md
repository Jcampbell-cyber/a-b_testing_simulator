# AdvancedAB website

Website for a website-testing (CRO) consultancy, plus free testing calculators and simulators under `/resources`.

Built with Vite, React, TypeScript and Tailwind. Hosted on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Where things live

| What | Where |
|---|---|
| Brand name, domain, prices, free plan turnaround, Formspree form ID | `src/site.ts` |
| Homepage, pricing, lessons, contact, resources hub | `src/pages/` |
| Header, footer, buttons, layout pieces | `src/components/site/` |
| List of every calculator and simulator (drives routes, menus and redirects) | `src/content/resources.ts` |
| Lessons copy | `src/content/lessons.ts` |
| Calculators and simulators | `src/components/` |
| Redirects from old URLs, clean URLs, caching headers | `vercel.json` |

Adding a new calculator: add the component, then add an entry to `src/content/resources.ts` (including its search title and description) and `src/content/resourceComponents.ts`.

## SEO and pre-rendering

`npm run build` pre-renders every page to its own HTML file (`scripts/prerender.mjs`, using `src/entry-server.tsx`), so search engines and link previews see the full page without running JavaScript. It also writes `sitemap.xml` from the same list of pages, so there is no sitemap to keep up to date by hand. Unknown URLs get `404.html` with a real 404 status.

Page titles, descriptions, sharing tags and structured data come from the `Seo` component (`src/components/site/Seo.tsx`). The link preview image is `public/og-image.png`.

## Contact form

Submissions go to Formspree (form `xdakpdye`, set in `src/site.ts`). Each submission includes the page the visitor came from (`source`) and which call-to-action wording they saw (`cta_variant`).

## A/B test on the call to action

The main "Get a free testing plan" button wording is an experiment, set up in `src/lib/analytics.ts`:

- PostHog feature flag: `free-plan-cta`, with variants `control` and `test`
- `control`: "Get a free testing plan"
- `test`: "Get 3 free test ideas"
- Goal event: `contact_form_submitted` (also tracked: `cta_clicked`)

If the flag doesn't exist or PostHog is blocked, everyone sees the control wording.
