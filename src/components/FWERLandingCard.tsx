import { GitMerge } from 'lucide-react';

interface FWERLandingCardProps {
  onGetStarted: (mode: 'fwer') => void;
}

export function FWERLandingCard({ onGetStarted }: FWERLandingCardProps) {
  return (
    <div className="bg-gray-800 border-2 border-[#0017D2] rounded-lg shadow-lg p-8 hover:border-white transition-colors">
      <div className="w-12 h-12 bg-[#0017D2] rounded-lg flex items-center justify-center mb-4">
        <GitMerge className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-white">
        Family‑Wise Error Rate (FWER)
      </h2>
      <p className="text-gray-300 mb-6 text-sm">
        Simulate multiple comparisons to see how Bonferroni, Holm, Tukey, and Dunnett
        corrections influence false‑positive and false‑negative rates.
      </p>
      <button
        onClick={() => onGetStarted('fwer')}
        className="bg-[#0017D2] text-white px-6 py-2 rounded-lg font-semibold 
                   hover:bg-white hover:text-[#0017D2] transition-colors shadow-md w-full"
      >
        Launch Calculator
      </button>
    </div>
  );
}