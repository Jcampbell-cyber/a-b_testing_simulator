import { useState } from 'react';
import { Menu, Home, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
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
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => onNavigate('landing')}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 hover:bg-[#0017D2] transition-colors"
          title="Go to Home"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 hover:bg-[#0017D2] transition-colors"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-20 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 z-50 w-64 max-h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
            <nav className="space-y-1">
              {pages.map((page) => {
                const isGroupHeader = !page.id;
                if (page.group && pages[pages.indexOf(page) - 1]?.group !== page.group) {
                  return (
                    <div key={`group-${page.group}`}>
                      <p className="text-xs font-semibold text-gray-400 px-4 py-2 mt-3 mb-1 uppercase tracking-wider">
                        {page.group}
                      </p>
                      <button
                        onClick={() => {
                          onNavigate(page.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          currentPage === page.id
                            ? 'bg-[#0017D2] text-white font-semibold'
                            : 'hover:bg-gray-700 text-gray-200'
                        }`}
                      >
                        {page.label}
                      </button>
                    </div>
                  );
                }

                if (!page.group && (pages[pages.indexOf(page) - 1]?.group !== null || pages.indexOf(page) === 0)) {
                  return (
                    <button
                      key={page.id}
                      onClick={() => {
                        onNavigate(page.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        currentPage === page.id
                          ? 'bg-[#0017D2] text-white font-semibold'
                          : 'hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      {page.label}
                    </button>
                  );
                }

                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      onNavigate(page.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      currentPage === page.id
                        ? 'bg-[#0017D2] text-white font-semibold'
                        : 'hover:bg-gray-700 text-gray-200'
                    }`}
                  >
                    {page.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
