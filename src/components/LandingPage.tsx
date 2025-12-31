import { Eye, Shield, Scale, Clock, GitMerge, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: (
    mode: 'nhst' | 'peeking' | 'guardrails' | 'imbalanced' | 'cuped' | 'fwer' | 'winsorizing' | 'sample-size-calc' | 'test-duration-calc' | 'effect-detection-calc' | 'test-results-calc'
  ) => void;
}

function CardSection({ title, cards }: { title: string; cards: React.ReactNode[] }) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards}
      </div>
    </div>
  );
}

function Card({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
      <h3 className="text-2xl font-bold mb-3 text-white text-center">{title}</h3>
      <p className="text-gray-300 mb-6 text-sm">
        {description}
      </p>
      <button
        onClick={onClick}
        className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
      >
        Launch
      </button>
    </div>
  );
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const understandingCards = [
    <Card
      key="nhst"
      title="Significance Testing"
      description="Visualize the relationship between statistical power, effect size, sample size, and alpha level in hypothesis testing."
      onClick={() => onGetStarted('nhst')}
    />,
    <Card
      key="peeking"
      title="Peeking Simulator"
      description="Understand how frequently checking test results inflates false positive rates based on p-values."
      onClick={() => onGetStarted('peeking')}
    />,
    <Card
      key="guardrails"
      title="Guardrails Simulator"
      description="Set manual or statistical guardrails to detect and stop tests when metrics fall below acceptable thresholds."
      onClick={() => onGetStarted('guardrails')}
    />,
    <Card
      key="imbalanced"
      title="Imbalanced Flights"
      description="Explore how imbalanced sample splits affect statistical power and sample size requirements."
      onClick={() => onGetStarted('imbalanced')}
    />,
    <Card
      key="cuped"
      title="CUPED Variance Reduction"
      description="Learn how CUPED reduces variance using pre-experiment data to improve test sensitivity."
      onClick={() => onGetStarted('cuped')}
    />,
    <Card
      key="fwer"
      title="Family‑Wise Error Rate"
      description="Simulate post‑hoc corrections like Bonferroni, Holm, Tukey, and Dunnett to explore their impact on false‑positive and false‑negative rates."
      onClick={() => onGetStarted('fwer')}
    />,
    <Card
      key="winsorizing"
      title="Winsorizing Simulator"
      description="Explore how winsorizing handles outliers by capping extreme values to reduce variance and improve statistical precision."
      onClick={() => onGetStarted('winsorizing')}
    />,
  ];

  const calculatorCards = [
    <Card
      key="sample-size"
      title="Sample Size Calculator"
      description="Calculate the required sample size based on effect size, power, and significance level."
      onClick={() => onGetStarted('sample-size-calc')}
    />,
    <Card
      key="test-duration"
      title="Test Duration Calculator"
      description="Estimate how long your test needs to run to achieve statistical significance."
      onClick={() => onGetStarted('test-duration-calc')}
    />,
    <Card
      key="effect-detection"
      title="Effect Detection Calculator"
      description="Determine the minimum detectable effect for your test configuration, including scaled sizes."
      onClick={() => onGetStarted('effect-detection-calc')}
    />,
    <Card
      key="test-results"
      title="Test Results Calculator"
      description="Analyze your test results and calculate confidence intervals and statistical significance."
      onClick={() => onGetStarted('test-results-calc')}
    />,
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            A/B Testing Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive tools to understand common pitfalls and advanced techniques in A/B testing
          </p>
        </div>

        <CardSection title="Calculators" cards={calculatorCards} />
        <CardSection title="Understanding & Simulators" cards={understandingCards} />

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Built to educate data scientists and product managers about proper A/B testing methodology.
          </p>
        </div>
      </div>
    </div>
  );
}