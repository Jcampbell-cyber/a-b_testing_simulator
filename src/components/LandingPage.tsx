import { Eye, Shield, Scale, Clock, GitMerge, TrendingUp, Mail } from 'lucide-react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

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

function Card({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
      <h3 className="text-2xl font-bold mb-3 text-white text-center">{title}</h3>
      <p className="text-gray-300 mb-6 text-sm">
        {description}
      </p>
      <Link
        to={to}
        className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full inline-block text-center"
      >
        Launch
      </Link>
    </div>
  );
}

export function LandingPage() {
  // Cards grouped by our new categories
  const experimentBestPracticeCards = [
    { title: "Significance Testing", desc: "Visualize the relationship between statistical power, effect size, sample size, and alpha level in hypothesis testing.", path: "/nhst" },
    { title: "Peeking Checks", desc: "Understand how frequently checking test results inflates false positive rates based on p-values.", path: "/peeking" },
    { title: "Statistical Guardrails", desc: "Set manual or statistical guardrails to detect and stop tests when metrics fall below acceptable thresholds.", path: "/guardrails" },
    { title: "Imbalanced Flights", desc: "Explore how imbalanced sample splits affect statistical power and sample size requirements.", path: "/imbalanced" },
  ];

  const advancedExperimentTechniquesCards = [
    { title: "CUPED Variance Reduction", desc: "Learn how CUPED reduces variance using pre-experiment data to improve test sensitivity.", path: "/cuped" },
    { title: "Family‑Wise Error Rate", desc: "Simulate post‑hoc corrections like Bonferroni, Holm, Tukey, and Dunnett to explore their impact on false‑positive and false‑negative rates.", path: "/fwer" },
    { title: "Winsorizing", desc: "Explore how winsorizing handles outliers by capping extreme values to reduce variance and improve statistical precision.", path: "/winsorizing" },
    { title: "Normalisation", desc: "Learn how to normalise metrics across segments with different baselines to ensure comparable aggregation in experiments.", path: "/normalisation" },
  ];

  const calculatorCards = [
    { title: "Sample Size Calculator", desc: "Calculate the required sample size based on effect size, power, and significance level.", path: "/sample-size-calc" },
    { title: "Test Duration Calculator", desc: "Estimate how long your test needs to run to achieve statistical significance.", path: "/test-duration-calc" },
    { title: "Effect Detection Calculator", desc: "Determine the minimum detectable effect for your test configuration, including scaled sizes.", path: "/effect-detection-calc" },
    { title: "Test Results Calculator", desc: "Analyze your test results and calculate confidence intervals and statistical significance.", path: "/test-results-calc" },
  ];

  const otherCards = [
    { title: "Glossary", desc: "A reference guide for terms and concepts used in experimentation and statistical testing.", path: "/glossary" },
    { title: "Feedback & Enquiries", desc: "Send us your questions or suggestions to help improve the platform.", path: "/feedback" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Advanced A/B Testing Concepts</title>
        <meta
          name="description"
          content="Interactive A/B testing tools and simulators to help data scientists and product managers understand best practices, pitfalls, and advanced experiment techniques."
        />
        <link rel="canonical" href="https://www.advancedab.tech/" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Advanced A/B Testing Concepts
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive tools to understand common pitfalls and advanced techniques in A/B (split) testing
          </p>
        </div>

        <CardSection
          title="Calculators"
          cards={calculatorCards.map(c => <Card key={c.path} title={c.title} description={c.desc} to={c.path} />)}
        />

        <CardSection
          title="Experiment Best Practices"
          cards={experimentBestPracticeCards.map(c => <Card key={c.path} title={c.title} description={c.desc} to={c.path} />)}
        />

        <CardSection
          title="Advanced Experiment Techniques"
          cards={advancedExperimentTechniquesCards.map(c => <Card key={c.path} title={c.title} description={c.desc} to={c.path} />)}
        />

        <CardSection
          title="Other"
          cards={otherCards.map(c => <Card key={c.path} title={c.title} description={c.desc} to={c.path} />)}
        />

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-6">
            Built to educate data scientists and product managers about proper A/B testing methodology.
          </p>
          <Link
            to="/feedback"
            className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-[#0017D2] px-4 py-2 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}
