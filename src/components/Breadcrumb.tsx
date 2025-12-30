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
  feedback: 'Feedback & Enquiries',
  glossary: 'Glossary',
};

export function Breadcrumb({ currentPage }: BreadcrumbProps) {
  if (currentPage === 'landing') {
    return null;
  }

  return (
    <div className="bg-gray-800/50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm">
          <span className="text-gray-400">Home</span>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
          <span className="text-white font-medium">
            {pageLabels[currentPage] || currentPage}
          </span>
        </div>
      </div>
    </div>
  );
}
