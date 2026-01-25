import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface SampleSizeCalculatorProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function SampleSizeCalculator({ onBack, onNavigate }: SampleSizeCalculatorProps) {
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
       2.506628277459239e+00
    ];
    const b = [
      -5.447609879822406e+01,
       1.615858368580409e+02,
      -1.556989798598866e+02,
       6.680131188771972e+01,
      -1.328068155288572e+01
    ];
    const c = [
      -7.784894002430293e-03,
      -3.223964580411365e-01,
      -2.400758277161838e+00,
      -2.549732539343734e+00,
       4.374664141464968e+00,
       2.938163982698783e+00
    ];
    const d = [
       7.784695709041462e-03,
       3.224671290700398e-01,
       2.445134137142996e+00,
       3.754408661907416e+00
    ];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number, r: number;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
             ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (((((a[0]*r + a[1])*r + a[2])*r + a[3])*r + a[4])*r + a[5]) * q /
             (((((b[0]*r + b[1])*r + b[2])*r + b[3])*r + b[4])*r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
              ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    }
  };

  const calculateSampleSize = () => {
    const numComparisons = comparisonType === 'none' ? 1 :
      comparisonType === 'control' ? numFlights - 1 :
      (numFlights * (numFlights - 1)) / 2;
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
      if (mdeType === 'absolute') {
        absoluteMde = mdeValue;
      } else {
        absoluteMde = (mdeValue / 100) * mean;
      }
      effectSize = absoluteMde / stdev;
      variance = 2;
      targetedMean = mean + absoluteMde;
    } else {
      if (mdeType === 'absolute') {
        absoluteMde = mdeValue / 100;
      } else {
        absoluteMde = (mdeValue / 100) * proportion;
      }
      effectSize = absoluteMde;
      variance = 2 * proportion * (1 - proportion);
      targetedProportion = Math.min(1, proportion + absoluteMde);
    }

    const samplesPerGroup = Math.ceil(
      (variance * Math.pow(zAlpha + zBeta, 2)) / Math.pow(effectSize, 2)
    );

    const totalSamples = samplesPerGroup * numFlights;

    return { samplesPerGroup, totalSamples, absoluteMde, effectSize, targetedProportion, targetedMean, adjustedAlpha };
  };

  const result = calculateSampleSize();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* SEO */}
      <Helmet>
        <title>Sample Size Calculator | Advanced AB Testing </title>
        <meta name="description" content="Calculate the minimum sample size needed for your A/B test with continuous or binary metrics. Understand MDE, power, and significance." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        {/* Calculator Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sample Size Calculator</h1>
          <p className="text-gray-300 mb-8">
            Determine the required sample size for your experiment with clear MDE, power, and significance insights.
          </p>

          {/* --- KEEP ALL ORIGINAL CALCULATOR INPUTS, RESULTS, MDE, FORMULAS HERE --- */}
          {/* Everything from your original code stays as-is */}
          {/* Inputs, results, formulas, explanations */}
          {/* ...all of your existing JSX for the calculator... */}
          {/* Include Results panel, How Calculation Works section, etc. */}

          {/* CTA at bottom */}
          <div className="mt-12 bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              Ready to see how long your experiment should run? Check out the
              <button
                onClick={() => onNavigate('test-duration-calc')}
                className="text-blue-400 hover:text-blue-300 ml-1 underline"
              >
                Test Duration Calculator 
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
