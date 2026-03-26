import { useState } from 'react';
import { Menu, Home, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const pages = [
  { id: 'landing', label: 'Home', group: null },
  { id: 'sample-size-calc', label: 'Sample Size Calculator', group: 'Calculators' },
  { id: 'test-duration-calc', label: 'Test Duration Calculator', group: 'Calculators' },
  { id: 'effect-detection-calc', label: 'Effect Detection Calculator', group: 'Calculators' },
  { id: 'test-results-calc', label: 'Test Results Calculator', group: 'Calculators' },
  { id: 'nhst', label: 'Significance Testing', group: 'Experiment Best Practices' },
  { id: 'peeking', label: 'Peeking Checks', group: 'Experiment Best Practices' },
  { id: 'guardrails', label: 'Statistical Guardrails', group: 'Experiment Best Practices' },
  { id: 'imbalanced', label: 'Imbalanced Flights', group: 'Experiment Best Practices' },
  { id: 'metric-variability-detectability', label: 'Metric Variability & Detectability', group: 'Experiment Best Practices' },
  { id: 'cuped', label: 'CUPED Variance Reduction', group: 'Advanced Experiment Techniques' },
  { id: 'fwer', label: 'Family-Wise Error Rate', group: 'Advanced Experiment Techniques' },
  { id: 'winsorizing', label: 'Winsorizing', group: 'Advanced Experiment Techniques' },
  { id: 'normalisation', label: 'Normalisation', group: 'Advanced Experiment Techniques' },
  { id: 'glossary', label: 'Glossary', group: 'Other' },
  { id: 'feedback', label: 'Feedback & Enquiries', group: 'Other' },
];

interface NavigationProps {
  currentPage: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const groupedLinks = (group: string) =>
    pages
      .filter(p => p.group === group)
      .map(p => (
        <Link
          key={p.id}
          to={`/${p.id}`}
          className={`block w-full px-4 py-2 rounded-md transition-colors ${
            currentPage === p.id
              ? 'bg-[#0017D2] text-white font-semibold'
              : 'hover:bg-gray-700 text-gray-200'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {p.label}
        </Link>
      ));

  return (
    <>
      {/* Fixed home button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 hover:bg-[#0017D2] transition-colors flex items-center justify-center w-10 h-10"
        >
          <Home className="w-6 h-6 text-white" />
        </Link>
      </div>

      {/* Fixed hamburger menu */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 hover:bg-[#0017D2] transition-colors flex items-center justify-center w-10 h-10"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-20 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 z-50 w-64 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
            <nav className="space-y-3">

              {/* Home */}
              {pages.filter(p => !p.group).map(p => (
                <Link
                  key={p.id}
                  to={p.id === 'landing' ? '/' : `/${p.id}`}
                  className={`block w-full px-4 py-2 rounded-md transition-colors ${
                    currentPage === p.id
                      ? 'bg-[#0017D2] text-white font-semibold'
                      : 'hover:bg-gray-700 text-gray-200'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {p.label}
                </Link>
              ))}

              {/* Calculators */}
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Calculators</p>
                {groupedLinks('Calculators')}
              </div>

              {/* Experiment Best Practices */}
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Experiment Best Practices</p>
                {groupedLinks('Experiment Best Practices')}
              </div>

              {/* Advanced Experiment Techniques */}
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Advanced Experiment Techniques</p>
                {groupedLinks('Advanced Experiment Techniques')}
              </div>

              {/* Other */}
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Other</p>
                {groupedLinks('Other')}
              </div>

            </nav>
          </div>
        </>
      )}
    </>
  );
}
