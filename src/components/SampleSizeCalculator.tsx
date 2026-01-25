import { useState, useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface SampleSizeCalculatorProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function SampleSizeCalculator({ onBack, onNavigate }: SampleSizeCalculatorProps) {
  // --- State ---
  const [metricType, setMetricType] = useState<'continuous' | 'binary'>('continuous');
  const [testType, setTestType] = useState<'two-sided' | 'one-sided'>('two-sided');
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [mdeType, setMdeType] = useState<'relative' | 'absolute'>('relative');
  const [mdeValue, setMdeValue] = useState(5);
  const [numFlights, setNumFlights] = useState(2);
  const [comparisonType, setComparisonType] = useState<'none' | 'control' | 'pairwise'>('none');
  const [mean, setMean] = useState(100);
  const [stdev, setStdev] = useState(20);
  const [proportion, setProportion] = useState(0.5);

  // --- Meta for SEO ---
  useEffect(() => {
    document.title = "Sample Size Calculator for A/B Testing | AdvancedAB";
    const meta = document.querySelector("meta[name='description']") || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Calculate the required sample size for your A/B test based on desired power, significance level, and effect size. Easy-to-use online tool for experiments."
    );
    document.head.appendChild(meta);
  }, []);

  // --- Normal inverse function ---
  const normalInverse = (p: number): number => { /* ...keep your existing code... */ };

  // --- Calculate sample size ---
  const calculateSampleSize = () => { /* ...keep your existing code... */ };
  const result = calculateSampleSize();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        {/* Page title */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sample Size Calculator for A/B Testing
          </h1>
          <p className="text-gray-300 mb-8">
            Calculate the required sample size for your experiment based on power, significance, and effect size.
          </p>

          {/* --- Your calculator UI --- */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left input section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Metric type, test type, alpha, power, MDE etc. */}
              {/* ... keep all of your existing input sections ... */}
            </div>

            {/* Results section */}
            <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-start h-fit sticky top-8">
              {/* ... keep all of your existing result display ... */}
            </div>
          </div>

          {/* How the calculation works */}
          <div className="mt-12 bg-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How the Calculation Works</h2>
            <div className="space-y-6 text-gray-300">
              {/* ... keep your existing "The Core Formula", "Key Components", etc. ... */}
            </div>
          </div>

          {/* --- CTA to next page --- */}
          <div className="mt-12 bg-blue-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Next Step: Estimate Test Duration
            </h2>
            <p className="text-gray-200 mb-4">
              Once you know your sample size, check out the <strong>Test Duration Calculator</strong> to estimate how long your experiment should run and plan your test effectively.
            </p>
            <button
              onClick={() => onNavigate('test-duration-calc')}
              className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go to Test Duration Calculator →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
