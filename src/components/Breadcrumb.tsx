import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  currentPage: string;
}

const pageLabels: Record<string, string> = {
  landing: 'Home',
  nhst: 'Significance Testing',
  peeking: 'Peeking Simulator',
  guardrails: 'Guardrails Simulator',
  fwer: 'Family-Wise Error Rate',
  imbalanced: 'Imbalanced Flights',
  cuped: 'CUPED Variance Reduction',
  winsorizing: 'Winsorizing Simulator',
  feedback: 'Feedback & Enquiries',
  glossary: 'Glossary',
  normalisation: 'Normalisation Simulator',
};

export function Breadcrumb({ currentPage }: BreadcrumbProps) {
  if (currentPage === 'landing') return null;

  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm space-x-2">
          <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium bg-gray-800 px-3 py-1 rounded-md shadow-sm">
            {pageLabels[currentPage] || currentPage}
          </span>
        </div>
      </div>
    </div>
  );
}
