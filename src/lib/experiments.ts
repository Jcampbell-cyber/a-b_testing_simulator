import { useEffect, useRef } from 'react';
import { capture, posthogReady } from './analytics';

/**
 * Site-owned A/B tests.
 *
 * Assignment happens in an inline script in index.html before first paint, which sets
 * `<html data-ab-<key>="control|test">`. Everything here only READS that attribute, so there is
 * one source of truth and PostHog can never disagree with what the visitor saw.
 *
 * Analytics:
 * - `experiment_exposed { experiment, variant, forced, $feature/<key> }` fires once per page view
 *   where the test is shown. In the PostHog experiment, set it as the custom exposure event and
 *   use the same key as the flag key. PostHog's flag stays unused; it only names the experiment.
 * - Every event also carries `ab_id` and `ab_<key>` super properties, so goal events like
 *   `cta_clicked` and `contact_form_submitted` can be split by variant too.
 * - Filter out `forced: true` (QA visits via ?ab-<key>=test).
 */
export type ExperimentKey = 'lessons-h1-surprise';
export type Variant = 'control' | 'test';

function readVariant(key: ExperimentKey): { variant: Variant; forced: boolean } | null {
  if (typeof document === 'undefined') return null;
  const el = document.documentElement;
  const v = el.getAttribute(`data-ab-${key}`);
  if (v !== 'control' && v !== 'test') return null;
  return { variant: v, forced: el.hasAttribute(`data-ab-${key}-forced`) };
}

if (typeof document !== 'undefined') {
  const id = document.cookie.match(/(?:^|; )ab_id=([^;]+)/)?.[1];
  const props: Record<string, string> = {};
  if (id) props.ab_id = id;
  for (const attr of Array.from(document.documentElement.attributes)) {
    if (attr.name.startsWith('data-ab-') && !attr.name.endsWith('-forced')) {
      props[`ab_${attr.name.slice('data-ab-'.length)}`] = attr.value;
    }
  }
  posthogReady.then(ph => ph?.register(props));
}

/** Call in the page that shows the test. Logs one exposure per page view. */
export function useExposure(key: ExperimentKey) {
  const logged = useRef(false); // survives StrictMode's double effect in dev
  useEffect(() => {
    if (logged.current) return;
    const a = readVariant(key);
    if (!a) return; // assignment failed, so this visitor isn't in the test
    logged.current = true;
    capture('experiment_exposed', {
      experiment: key,
      variant: a.variant,
      forced: a.forced,
      // PostHog experiments read the variant from `$feature/<flag key>` on a custom exposure event.
      // Left off for forced QA visits, so they never count in the results.
      ...(a.forced ? {} : { [`$feature/${key}`]: a.variant }),
    });
  }, [key]);
}
