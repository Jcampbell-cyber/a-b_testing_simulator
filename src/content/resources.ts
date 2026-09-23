// Single source of truth for every page under /resources.
// Routes, redirects from the old URLs, the Resources hub, menus and
// breadcrumbs are all generated from this list.

export type SectionId = 'calculators' | 'best-practices' | 'advanced-techniques';

export interface Section {
  id: SectionId;
  title: string;
  shortTitle: string;
  description: string;
}

export interface ResourcePage {
  /** Component key, matched to a lazily loaded page in resourceComponents.ts */
  key: string;
  section: SectionId | null;
  /** Path segment under the section, e.g. "sample-size-calc" */
  slug: string;
  title: string;
  description: string;
  /** URL this page lived at before the redesign */
  oldPath: string;
  /** Hidden from lists (e.g. the bootstrap A/B sub-page) */
  hidden?: boolean;
}

export const sections: Section[] = [
  {
    id: 'calculators',
    title: 'Calculators',
    shortTitle: 'Calculators',
    description: 'Plan and read your tests: sample size, duration, detectable effects and results.',
  },
  {
    id: 'best-practices',
    title: 'Experiment best practices',
    shortTitle: 'Best practices',
    description: 'Interactive simulators that show the most common ways tests go wrong, and how to avoid them.',
  },
  {
    id: 'advanced-techniques',
    title: 'Advanced techniques',
    shortTitle: 'Advanced techniques',
    description: 'The methods experienced experimentation teams use to get clearer answers from less traffic.',
  },
];

export const resourcePages: ResourcePage[] = [
  // Calculators
  { key: 'sample-size', section: 'calculators', slug: 'sample-size-calc', oldPath: '/sample-size-calc', title: 'Sample Size Calculator', description: 'Calculate the required sample size based on effect size, power, and significance level.' },
  { key: 'test-duration', section: 'calculators', slug: 'test-duration-calc', oldPath: '/test-duration-calc', title: 'Test Duration Calculator', description: 'Estimate how long your test needs to run to achieve statistical significance.' },
  { key: 'effect-detection', section: 'calculators', slug: 'effect-detection-calc', oldPath: '/effect-detection-calc', title: 'Effect Detection Calculator', description: 'Determine the minimum detectable effect for your test configuration, including scaled sizes.' },
  { key: 'test-results', section: 'calculators', slug: 'test-results-calc', oldPath: '/test-results-calc', title: 'Test Results Calculator', description: 'Analyse your test results and calculate confidence intervals and statistical significance.' },

  // Experiment best practices
  { key: 'nhst', section: 'best-practices', slug: 'nhst', oldPath: '/nhst', title: 'Significance Testing', description: 'See how statistical power, effect size, sample size and significance level relate to each other.' },
  { key: 'peeking', section: 'best-practices', slug: 'peeking', oldPath: '/peeking', title: 'Peeking Checks', description: 'Understand how checking results too often inflates false positive rates.' },
  { key: 'guardrails', section: 'best-practices', slug: 'guardrails', oldPath: '/guardrails', title: 'Statistical Guardrails', description: 'Set manual or statistical guardrails to stop tests when key metrics fall below acceptable levels.' },
  { key: 'imbalanced', section: 'best-practices', slug: 'imbalanced', oldPath: '/imbalanced', title: 'Imbalanced Flights', description: 'Explore how uneven traffic splits affect statistical power and sample size requirements.' },
  { key: 'metric-variability', section: 'best-practices', slug: 'metric-variability-detectability', oldPath: '/metric-variability-detectability', title: 'Metric Variability & Detectability', description: 'Learn how variability differs for proportion and continuous metrics, and how it affects the minimum detectable effect.' },

  // Advanced techniques
  { key: 'cuped', section: 'advanced-techniques', slug: 'cuped', oldPath: '/cuped', title: 'CUPED Variance Reduction', description: 'Learn how CUPED uses pre-experiment data to reduce variance and improve test sensitivity.' },
  { key: 'fwer', section: 'advanced-techniques', slug: 'fwer', oldPath: '/fwer', title: 'Family-Wise Error Rate', description: 'Simulate corrections like Bonferroni, Holm, Tukey and Dunnett and their impact on false positive and false negative rates.' },
  { key: 'winsorizing', section: 'advanced-techniques', slug: 'winsorizing', oldPath: '/winsorizing', title: 'Winsorizing', description: 'See how capping extreme values handles outliers, reduces variance and improves precision.' },
  { key: 'normalisation', section: 'advanced-techniques', slug: 'normalisation', oldPath: '/normalisation', title: 'Normalisation', description: 'Normalise metrics across segments with different baselines so results can be compared and combined.' },
  { key: 'bootstrap', section: 'advanced-techniques', slug: 'bootstrap', oldPath: '/bootstrap', title: 'Bootstrapping', description: 'Estimate uncertainty directly from your data using resampling, without distribution assumptions.' },
  { key: 'bootstrap-ab', section: 'advanced-techniques', slug: 'bootstrap/ab', oldPath: '/bootstrap/ab', title: 'Bootstrap A/B Testing', description: 'Compare two versions using bootstrap resampling of the difference between them.', hidden: true },

  // Reference
  { key: 'glossary', section: null, slug: 'glossary', oldPath: '/glossary', title: 'Glossary', description: 'Plain-English definitions of the terms used in testing and experimentation.' },
];

export function sectionPath(id: SectionId) {
  return `/resources/${id}`;
}

export function resourcePath(page: ResourcePage) {
  return page.section ? `${sectionPath(page.section)}/${page.slug}` : `/resources/${page.slug}`;
}

export function getSection(id: SectionId) {
  return sections.find(s => s.id === id)!;
}

export function pagesInSection(id: SectionId, { includeHidden = false } = {}) {
  return resourcePages.filter(p => p.section === id && (includeHidden || !p.hidden));
}

/** Old URL -> new URL, used for in-app redirects (Vercel handles them in production) */
export const legacyRedirects: Record<string, string> = {
  ...Object.fromEntries(resourcePages.map(p => [p.oldPath, resourcePath(p)])),
  '/feedback': '/contact',
};
