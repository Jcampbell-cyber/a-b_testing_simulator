import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  currentPage: string;
}

const pageLabels: Record<string, string> = {
  landing: 'Home',
  'sample-size-calc': 'Sample Size Calculator',
  'test-duration-calc': 'Test Duration Calculator',
  'effect-detection-calc': 'Effect Detection Calculator',
  'test-results-calc': 'Test Results Calculator',
  nhst: 'Significance Testing',
  peeking: 'Peeking Simulator',
  guardrails: 'Guardrails Simulator',
  imbalanced: 'Imbalanced Flights',
  'metric-variability-detectability': 'Metric Variability & Detectability',
  cuped: 'CUPED Variance Reduction',
  fwer: 'Family-Wise Error Rate',
  winsorizing: 'Winsorizing Simulator',
  normalisation: 'Normalisation Simulator',
  bootstrap: 'Bootstrapping Simulator',
  'bootstrap/ab': 'Bootstrap A/B Testing',
  glossary: 'Glossary',
  feedback: 'Feedback & Enquiries',
};

export function Breadcrumb({ currentPage }: BreadcrumbProps) {
  if (currentPage === 'landing') return null;

  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm space-x-2">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium bg-gray-800 px-3 py-1 rounded-md shadow-sm">
            {pageLabels[currentPage] || currentPage}
          </span>
        </div>
      </div>
    </div>
  );
}
