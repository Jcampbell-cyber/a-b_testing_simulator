import { Eye, Shield, Scale, Clock, GitMerge, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: (
    mode: 'nhst' | 'peeking' | 'guardrails' | 'imbalanced' | 'cuped' | 'fwer'
  ) => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            A/B Test Calculators
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive tools to understand common pitfalls and advanced techniques in A/B testing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* NHST Power Analysis */}
          <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
            <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Significance Testing</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Visualize the relationship between statistical power, effect size, sample size, and alpha level in hypothesis testing.
            </p>
            <button
              onClick={() => onGetStarted('nhst')}
              className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
            >
              Launch Calculator
            </button>
          </div>

          {/* Peeking Simulator */}
          <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
            <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Peeking Simulator</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Understand how frequently checking test results inflates false positive rates based on p-values.
            </p>
            <button
              onClick={() => onGetStarted('peeking')}
              className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
            >
              Launch Calculator
            </button>
          </div>

          {/* Guardrails Simulator */}
          <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
            <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Guardrails Simulator</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Set manual or statistical guardrails to detect and stop tests when metrics fall below acceptable thresholds.
            </p>
            <button
              onClick={() => onGetStarted('guardrails')}
              className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
            >
              Launch Calculator
            </button>
          </div>

          {/* Imbalanced Flights */}
          <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
            <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Imbalanced Flights</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Explore how imbalanced sample splits affect statistical power and sample size requirements.
            </p>
            <button
              onClick={() => onGetStarted('imbalanced')}
              className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
            >
              Launch Calculator
            </button>
          </div>

          {/* CUPED */}
          <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
            <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">CUPED Variance Reduction</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Learn how CUPED reduces variance using pre-experiment data to improve test sensitivity.
            </p>
            <button
              onClick={() => onGetStarted('cuped')}
              className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
            >
              Launch Calculator
            </button>
          </div>

          {/* NEW: Family-Wise Error Rate (FWER) Simulator */}
          <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
            <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
              <GitMerge className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Family‑Wise Error Rate</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Simulate post‑hoc corrections like Bonferroni, Holm, Tukey, and Dunnett to explore their impact on false‑positive and false‑negative rates.
            </p>
            <button
              onClick={() => onGetStarted('fwer')}
              className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
            >
              Launch Calculator
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Built to educate data scientists and product managers about proper A/B testing methodology.
          </p>
        </div>
      </div>
    </div>
  );
}