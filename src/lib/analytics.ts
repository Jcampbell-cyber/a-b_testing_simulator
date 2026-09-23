import { useEffect, useState } from 'react';
import type { PostHog } from 'posthog-js';

// PostHog is large (~100 KB gzipped), so it loads in the background after the
// page has rendered instead of blocking the first paint.
const posthogReady: Promise<PostHog | null> =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : import('posthog-js')
        .then(({ default: posthog }) => {
          posthog.init('phc_kJqyofaSXhRqdD9cW768tjFaYFm2A9db3amwaudL74Gd', {
            api_host: 'https://eu.i.posthog.com',
            // Record a pageview on every client-side route change, not just the first load.
            capture_pageview: 'history_change',
            person_profiles: 'identified_only',
          });
          return posthog;
        })
        .catch(() => null); // Blocked by an ad blocker, offline, etc. The site works without it.

function capture(event: string, props: Record<string, unknown>) {
  posthogReady.then(ph => ph?.capture(event, props));
}

/**
 * A/B test on the main call to action.
 *
 * PostHog feature flag: `free-plan-cta` (multivariate: `control`, `test`).
 * Goal event for the experiment: `contact_form_submitted`.
 *
 * Until the flag loads (or if PostHog is blocked), everyone sees the control
 * wording, so the page never renders blank.
 */
export const CTA_FLAG = 'free-plan-cta';

const CTA_LABELS = {
  control: 'Get a free testing plan',
  test: 'Get 3 free test ideas',
} as const;

export type CtaVariant = keyof typeof CTA_LABELS;

let currentVariant: CtaVariant = 'control';
const listeners = new Set<(v: CtaVariant) => void>();

posthogReady.then(ph => {
  ph?.onFeatureFlags(() => {
    currentVariant = ph.getFeatureFlag(CTA_FLAG) === 'test' ? 'test' : 'control';
    listeners.forEach(fn => fn(currentVariant));
  });
});

export function useCta(): { variant: CtaVariant; label: string } {
  const [variant, setVariant] = useState<CtaVariant>(currentVariant);
  useEffect(() => {
    listeners.add(setVariant);
    setVariant(currentVariant);
    return () => {
      listeners.delete(setVariant);
    };
  }, []);
  return { variant, label: CTA_LABELS[variant] };
}

export function trackCtaClick(location: string, variant: CtaVariant) {
  capture('cta_clicked', { location, cta_variant: variant });
}

export function trackContactSubmitted(props: Record<string, string | undefined>) {
  capture('contact_form_submitted', props);
}
