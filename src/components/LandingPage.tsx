import { Eye, Shield, Scale, Clock, GitMerge, TrendingUp, Mail } from 'lucide-react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useFeatureFlagVariantKey } from 'posthog-js/react';

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

// ---- New variant-only building blocks (test branch) ----

function ToolCard({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="block border border-[#C7CBC0] p-6 hover:border-[#14181C] transition-colors bg-transparent"
    >
      <h3 className="font-mono text-lg text-[#14181C] mb-2">{title}</h3>
      <p className="text-sm text-[#565F57] leading-relaxed">{description}</p>
    </Link>
  );
}

function ProcessStep({
  index,
  icon,
  title,
  description,
}: {
  index: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <span className="font-mono text-sm text-[#565F57] pt-1 w-5 shrink-0">{index}</span>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#14181C]">{icon}</span>
          <h3 className="font-mono text-base text-[#14181C]">{title}</h3>
        </div>
        <p className="text-sm text-[#565F57] leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  const variant = useFeatureFlagVariantKey('new-design-test');

  // `variant` is undefined until the flag request resolves — this is the
  // common case for first-time visitors, who have nothing cached yet.
  // Without this gate, every one of those visitors falls through to the
  // control `return` below (since undefined !== 'test'), which is almost
  // certainly why "everyone" was landing on control.
  if (variant === undefined) {
    return null;
  }

  const experimentBestPracticeCards = [
    { title: "Significance Testing", desc: "Visualize the relationship between statistical power, effect size, sample size, and alpha level in hypothesis testing.", path: "/nhst" },
    { title: "Peeking Checks", desc: "Understand how frequently checking test results inflates false positive rates based on p-values.", path: "/peeking" },
    { title: "Statistical Guardrails", desc: "Set manual or statistical guardrails to detect and stop tests when metrics fall below acceptable thresholds.", path: "/guardrails" },
    { title: "Imbalanced Flights", desc: "Explore how imbalanced sample splits affect statistical power and sample size requirements.", path: "/imbalanced" },
    { title: "Metric Variability & Detectability", desc: "Learn how variability differs for proportion vs continuous metrics, how it affects minimum detectable effects (MDE).", path: "/metric-variability-detectability" },
  ];

  const advancedExperimentTechniquesCards = [
    { title: "CUPED Variance Reduction", desc: "Learn how CUPED reduces variance using pre-experiment data to improve test sensitivity.", path: "/cuped" },
    { title: "Family‑Wise Error Rate", desc: "Simulate post‑hoc corrections like Bonferroni, Holm, Tukey, and Dunnett to explore their impact on false‑positive and false‑negative rates.", path: "/fwer" },
    { title: "Winsorizing", desc: "Explore how winsorizing handles outliers by capping extreme values to reduce variance and improve statistical precision.", path: "/winsorizing" },
    { title: "Normalisation", desc: "Learn how to normalise metrics across segments with different baselines to ensure comparable aggregation in experiments.", path: "/normalisation" },
    { title: "Bootstrapping", desc: "Learn how to estimate uncertainty directly from your data using resampling, without relying on distributional assumptions.", path: "/bootstrap" }
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

  if (variant === 'test') {
    return (
      <div className="min-h-screen bg-[#EEF0EA] text-[#14181C]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <Helmet>
          <title>Fix your A/B tests before they cost you</title>
          <meta
            name="description"
            content="I audit, design, and monitor conversion experiments so the lift you report is the lift you actually get. Statistical rigor for teams that don't have a data scientist on hand."
          />
          <link rel="canonical" href="https://www.advancedab.tech/" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500&display=swap" rel="stylesheet" />
        </Helmet>

        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                className="text-4xl md:text-[2.75rem] leading-tight mb-5"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Your test says it won.
                <br />
                The math might disagree.
              </h1>
              <p className="text-base text-[#565F57] mb-8 max-w-md leading-relaxed">
                I audit and design conversion experiments so the lift you report is the lift you'll
                actually see in revenue — no peeking bias, no underpowered rollouts, no missing guardrails.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/feedback"
                  className="bg-[#14181C] text-[#EEF0EA] px-6 py-3 font-mono text-sm hover:bg-[#2F6F4F] transition-colors"
                >
                  Get a second opinion on your test
                </Link>
                <a href="#toolkit" className="text-sm underline decoration-[#C7CBC0] underline-offset-4 hover:decoration-[#14181C]">
                  See how the checks work
                </a>
              </div>
            </div>

            {/* Readout panel — the memorable hero element */}
            <div className="border border-[#C7CBC0] bg-white/40 p-6">
              <p className="font-mono text-xs text-[#565F57] mb-4">Guardrail check — day 9 of planned 14</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-2 border-[#B8432E] pl-3">
                  <p className="font-mono text-xs text-[#565F57] mb-1">Variant A</p>
                  <p className="font-mono text-2xl mb-1">12.4%</p>
                  <p className="text-xs text-[#B8432E]">82% confidence — not significant</p>
                </div>
                <div className="border-l-2 border-[#2F6F4F] pl-3">
                  <p className="font-mono text-xs text-[#565F57] mb-1">Variant B</p>
                  <p className="font-mono text-2xl mb-1">14.9%</p>
                  <p className="text-xs text-[#2F6F4F]">97% confidence — significant</p>
                </div>
              </div>
              <p className="text-xs text-[#565F57] mt-5 pt-4 border-t border-[#C7CBC0] leading-relaxed">
                Peeking flagged on day 4 — an early call would have shipped the wrong variant.
                This is the kind of read I do on your test before you ship it.
              </p>
            </div>
          </div>
        </div>

        {/* Problem framing */}
        <div className="max-w-5xl mx-auto px-6 py-16 border-t border-[#C7CBC0]">
          <h2 className="font-mono text-xl mb-8">Most A/B tests don't fail loudly. They fail quietly.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Eye className="w-5 h-5 mb-3" />
              <p className="text-sm text-[#565F57] leading-relaxed">
                Someone checks the dashboard daily and ships the moment it looks green — inflating the false
                positive rate without anyone noticing.
              </p>
            </div>
            <div>
              <Scale className="w-5 h-5 mb-3" />
              <p className="text-sm text-[#565F57] leading-relaxed">
                The test never had enough traffic to detect the effect size it was designed for, so "no
                difference" gets read as "it didn't work."
              </p>
            </div>
            <div>
              <Shield className="w-5 h-5 mb-3" />
              <p className="text-sm text-[#565F57] leading-relaxed">
                No guardrail metric was watching checkout or retention, so a win on the primary metric ships
                alongside a quiet loss somewhere else.
              </p>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="max-w-5xl mx-auto px-6 py-16 border-t border-[#C7CBC0]">
          <h2 className="font-mono text-xl mb-10">How this works</h2>
          <div className="space-y-8">
            <ProcessStep
              index="01"
              icon={<Eye className="w-4 h-4" />}
              title="Audit"
              description="I review your current or planned test for peeking, underpowered samples, and missing guardrails."
            />
            <ProcessStep
              index="02"
              icon={<GitMerge className="w-4 h-4" />}
              title="Design"
              description="We set the right sample size, minimum detectable effect, and stopping rules before you launch."
            />
            <ProcessStep
              index="03"
              icon={<Clock className="w-4 h-4" />}
              title="Monitor"
              description="I watch the test run and flag it the moment a guardrail trips, so you don't ship a false win."
            />
          </div>
        </div>

        {/* Toolkit — repositioned existing content */}
        <div id="toolkit" className="max-w-5xl mx-auto px-6 py-16 border-t border-[#C7CBC0]">
          <h2 className="font-mono text-xl mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            The toolkit behind the checks
          </h2>
          <p className="text-sm text-[#565F57] mb-10 max-w-lg leading-relaxed">
            These are the same calculators and simulators I use on client tests — open to anyone who wants
            to see the methodology before hiring someone to apply it.
          </p>

          <div className="mb-10">
            <p className="font-mono text-xs text-[#565F57] mb-4">Calculators</p>
            <div className="grid md:grid-cols-2 gap-3">
              {calculatorCards.map(c => (
                <ToolCard key={c.path} title={c.title} description={c.desc} to={c.path} />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="font-mono text-xs text-[#565F57] mb-4">Common pitfalls</p>
            <div className="grid md:grid-cols-2 gap-3">
              {experimentBestPracticeCards.map(c => (
                <ToolCard key={c.path} title={c.title} description={c.desc} to={c.path} />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="font-mono text-xs text-[#565F57] mb-4">Advanced techniques</p>
            <div className="grid md:grid-cols-2 gap-3">
              {advancedExperimentTechniquesCards.map(c => (
                <ToolCard key={c.path} title={c.title} description={c.desc} to={c.path} />
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-[#565F57] mb-4">Other</p>
            <div className="grid md:grid-cols-2 gap-3">
              {otherCards.map(c => (
                <ToolCard key={c.path} title={c.title} description={c.desc} to={c.path} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-5xl mx-auto px-6 py-16 border-t border-[#C7CBC0] text-center">
          <h2 className="font-mono text-xl mb-3">Not sure if your last test result holds up?</h2>
          <p className="text-sm text-[#565F57] mb-8 max-w-md mx-auto leading-relaxed">
            Send me the setup and the result. I'll tell you, in plain terms, whether you can trust it.
          </p>
          <Link
            to="/feedback"
            className="inline-flex items-center gap-2 border border-[#14181C] px-5 py-2.5 font-mono text-sm hover:bg-[#14181C] hover:text-[#EEF0EA] transition-colors"
          >
            <Mail className="w-4 h-4" />
            Get in touch
          </Link>
        </div>
      </div>
    );
  }

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
