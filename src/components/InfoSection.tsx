import { BookOpen, Info } from 'lucide-react';

export function InfoSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Understanding A/B Test Peeking</h2>
      </div>

      <div className="space-y-4 text-gray-700">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What is Peeking?</h3>
              <p className="text-sm text-blue-800">
                Peeking refers to checking your A/B test results multiple times before the planned end date
                and making decisions based on interim results. While tempting, this practice significantly
                increases false positive rates.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Why Peeking is Problematic:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Inflated False Positives:</strong> Each peek is essentially running multiple statistical tests,
              increasing the chance of finding a significant result by random chance.
            </li>
            <li>
              <strong>Selection Bias:</strong> Stopping when you see favorable results ignores natural variance
              and regression to the mean.
            </li>
            <li>
              <strong>Invalid Confidence Intervals:</strong> Traditional 95% confidence intervals assume a single test,
              not multiple looks at accumulating data.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Using This Simulator:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Set your expected effect size and variability</li>
            <li>Define guardrails for acceptable negative and positive changes</li>
            <li>Adjust peeking frequency to see how it affects false positives</li>
            <li>See how often conflicting signals appear during a single test</li>
          </ul>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
          <h3 className="font-semibold text-green-900 mb-2">Better Alternatives:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
            <li>Use sequential testing methods with adjusted thresholds</li>
            <li>Implement always-valid p-values or confidence sequences</li>
            <li>Pre-commit to a sample size based on power analysis</li>
            <li>Use Bayesian methods that naturally handle sequential testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
