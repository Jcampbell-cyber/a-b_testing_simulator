import { useState } from 'react';
import { Menu, Home, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  currentPage: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { id: 'landing', label: 'Home', group: null },
    { id: 'sample-size-calc', label: 'Sample Size Calculator', group: 'Calculators' },
    { id: 'test-duration-calc', label: 'Test Duration Calculator', group: 'Calculators' },
    { id: 'effect-detection-calc', label: 'Effect Detection Calculator', group: 'Calculators' },
    { id: 'test-results-calc', label: 'Test Results Calculator', group: 'Calculators' },
    { id: 'nhst', label: 'Significance Testing', group: 'Understanding & Simulators' },
    { id: 'peeking', label: 'Peeking Simulator', group: 'Understanding & Simulators' },
    { id: 'guardrails', label: 'Guardrails Simulator', group: 'Understanding & Simulators' },
    { id: 'imbalanced', label: 'Imbalanced Flights', group: 'Understanding & Simulators' },
    { id: 'cuped', label: 'CUPED Variance Reduction', group: 'Understanding & Simulators' },
    { id: 'fwer', label: 'Family-Wise Error Rate', group: 'Understanding & Simulators' },
    { id: 'winsorizing', label: 'Winsorizing Simulator', group: 'Understanding & Simulators' },
    { id: 'normalisation', label: 'Normalisation Simulator', group: 'Understanding & Simulators' },
    { id: 'glossary', label: 'Glossary', group: null },
    { id: 'feedback', label: 'Feedback & Enquiries', group: null },
  ];

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

          <div className="fixed top-20 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 z-50 w-64 max-h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
            <nav className="space-y-3">
  {/* Ungrouped (top) */}
  {pages
    .filter(p => p.group === null)
    .map((page) => (
      <Link
        key={page.id}
        to={page.id === 'landing' ? '/' : `/${page.id}`}
        className={`block w-full px-4 py-2 rounded-md transition-colors ${
          currentPage === page.id
            ? 'bg-[#0017D2] text-white font-semibold'
            : 'hover:bg-gray-700 text-gray-200'
        }`}
        onClick={() => setIsOpen(false)}
      >
        {page.label}
      </Link>
    ))}

  {/* Calculators */}
  <div>
    <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
      Calculators
    </p>
    {pages
      .filter(p => p.group === 'Calculators')
      .map((page) => (
        <Link
          key={page.id}
          to={`/${page.id}`}
          className={`block w-full px-4 py-2 rounded-md transition-colors ${
            currentPage === page.id
              ? 'bg-[#0017D2] text-white font-semibold'
              : 'hover:bg-gray-700 text-gray-200'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {page.label}
        </Link>
      ))}
  </div>

  {/* Understanding & Simulators */}
  <div>
    <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
      Understanding & Simulators
    </p>
    {pages
      .filter(p => p.group === 'Understanding & Simulators')
      .map((page) => (
        <Link
          key={page.id}
          to={`/${page.id}`}
          className={`block w-full px-4 py-2 rounded-md transition-colors ${
            currentPage === page.id
              ? 'bg-[#0017D2] text-white font-semibold'
              : 'hover:bg-gray-700 text-gray-200'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {page.label}
        </Link>
      ))}
  </div>
</nav>
          </div>
        </>
      )}
    </>
  );
}
