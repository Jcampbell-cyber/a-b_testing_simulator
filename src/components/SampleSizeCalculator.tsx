import { useState, useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface SampleSizeCalculatorProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function SampleSizeCalculator({ onBack, onNavigate }: SampleSizeCalculatorProps) {
  // SEO: update document title & meta description
  useEffect(() => {
    document.title = 'Sample Size Calculator | AdvancedAB';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Use our Sample Size Calculator to determine the number of participants needed for your A/B test with correct power and significance levels.'
      );
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content =
        'Use our Sample Size Calculator to determine the number of participants needed for your A/B test with correct power and significance levels.';
      document.head.appendChild(newMeta);
    }
  }, []);

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

  const normalInverse = (p: number): number => {
    if (p <= 0 || p >= 1) return 0;
    if (p === 0.5) return 0;

    const a = [
      -3.969683028665376e+01,
      2.209460984245205e+02,
      -2.759285104469687e+02,
      1.383577518672690e+02,
      -3.066479806614716e+01,
      2.506628277459239e+00,
    ];
    const b = [
      -5.447609879822406e+01,
      1.615858368580409e+02,
      -1.556989798598866e+02,
      6.680131188771972e+01,
      -1.328068155288572e+01,
    ];
    const c = [
      -7.784894002430293e-03,
      -3.223964580411365e-01,
      -2.400758277161838e+00,
      -2.549732539343734e+00,
      4.374664141464968e+00,
      2.938163982698783e+00,
    ];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number, r: number;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
  };

  const calculateSampleSize = () => {
    const numComparisons =
      comparisonType === 'none'
        ? 1
        : comparisonType === 'control'
        ? numFlights - 1
        : (numFlights * (numFlights - 1)) / 2;
    const adjustedAlpha = alpha / numComparisons;
    const alphaTwoSided = testType === 'two-sided' ? adjustedAlpha / 2 : adjustedAlpha;
    const zAlpha = normalInverse(1 - alphaTwoSided);
    const zBeta = normalInverse(power);

    let effectSize = 0;
    let variance = 1;
    let absoluteMde = 0;
    let targetedProportion = 0;
    let targetedMean = 0;

    if (metricType === 'continuous') {
      absoluteMde = mdeType === 'absolute' ? mdeValue : (mdeValue / 100) * mean;
      effectSize = absoluteMde / stdev;
      variance = 2;
      targetedMean = mean + absoluteMde;
    } else {
      absoluteMde = mdeType === 'absolute' ? mdeValue / 100 : (mdeValue / 100) * proportion;
      effectSize = absoluteMde;
      variance = 2 * proportion * (1 - proportion);
      targetedProportion = Math.min(1, proportion + absoluteMde);
    }

    const samplesPerGroup = Math.ceil((variance * Math.pow(zAlpha + zBeta, 2)) / Math.pow(effectSize, 2));
    const totalSamples = samplesPerGroup * numFlights;

    return { samplesPerGroup, totalSamples, absoluteMde, effectSize, targetedProportion, targetedMean, adjustedAlpha };
  };

  const result = calculateSampleSize();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        {/* Main calculator content */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sample Size Calculator</h1>
          <p className="text-gray-300 mb-8">
            Calculate the required sample size for your A/B test.
          </p>

          {/* ...keep all existing calculator JSX here (inputs, results, ranges, etc.) ... */}

          {/* CTA at bottom for SEO & navigation */}
          <div className="mt-12 bg-gray-700 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to calculate test duration?
            </h2>
            <p className="text-gray-300 mb-4">
              After determining the required sample size, it's important to know how long your A/B test will need to run to detect the effect with confidence.
            </p>
            <button
              onClick={() => onNavigate('test-duration-calc')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Go to Test Duration Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
