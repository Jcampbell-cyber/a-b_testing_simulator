import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

// Each resource page loads on demand, so the charting library and simulators
// never slow down the homepage.
export const resourceComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  'sample-size': lazy(() => import('../components/SampleSizeCalculator').then(m => ({ default: m.SampleSizeCalculator }))),
  'test-duration': lazy(() => import('../components/TestDurationCalculator').then(m => ({ default: m.TestDurationCalculator }))),
  'effect-detection': lazy(() => import('../components/EffectDetectionCalculator').then(m => ({ default: m.EffectDetectionCalculator }))),
  'test-results': lazy(() => import('../components/TestResultsCalculator').then(m => ({ default: m.TestResultsCalculator }))),
  nhst: lazy(() => import('../components/NHSTPage')),
  peeking: lazy(() => import('../components/PeekingPage').then(m => ({ default: m.PeekingPage }))),
  guardrails: lazy(() => import('../components/GuardrailsPage').then(m => ({ default: m.GuardrailsPage }))),
  imbalanced: lazy(() => import('../components/ImbalancedFlightsPage').then(m => ({ default: m.ImbalancedFlightsPage }))),
  'metric-variability': lazy(() => import('../components/MetricVariabilityDetectability').then(m => ({ default: m.VariabilityVsCoevPage }))),
  cuped: lazy(() => import('../components/CUPEDPage').then(m => ({ default: m.CUPEDPage }))),
  fwer: lazy(() => import('../components/FWERPage').then(m => ({ default: m.FWERPage }))),
  winsorizing: lazy(() => import('../components/WinsorizingPage').then(m => ({ default: m.WinsorizingPage }))),
  normalisation: lazy(() => import('../components/NormalisationPage').then(m => ({ default: m.NormalisationPage }))),
  bootstrap: lazy(() => import('../components/BootstrapMeanPage').then(m => ({ default: m.BootstrapMeanPage }))),
  'bootstrap-ab': lazy(() => import('../components/BootstrapABPage').then(m => ({ default: m.BootstrapABPage }))),
  glossary: lazy(() => import('../components/GlossaryPage').then(m => ({ default: m.GlossaryPage }))),
};
