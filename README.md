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
| Redirects from old URLs, caching headers | `vercel.json` |

Adding a new calculator: add the component, add an entry to `src/content/resources.ts` and `src/content/resourceComponents.ts`, and add the URL to `public/sitemap.xml`.

## Contact form

Submissions go to Formspree (form `xdakpdye`, set in `src/site.ts`). Each submission includes the page the visitor came from (`source`) and which call-to-action wording they saw (`cta_variant`).

## A/B test on the call to action

The main "Get a free testing plan" button wording is an experiment, set up in `src/lib/analytics.ts`:

- PostHog feature flag: `free-plan-cta`, with variants `control` and `test`
- `control`: "Get a free testing plan"
- `test`: "Get 3 free test ideas"
- Goal event: `contact_form_submitted` (also tracked: `cta_clicked`)

If the flag doesn't exist or PostHog is blocked, everyone sees the control wording.
