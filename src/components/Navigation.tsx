import { useState } from 'react';
import { Menu, Home, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { id: 'landing', label: 'Home', group: null, path: '/' },
    { id: 'sample-size-calc', label: 'Sample Size Calculator', group: 'Calculators', path: '/sample-size-calc' },
    { id: 'test-duration-calc', label: 'Test Duration Calculator', group: 'Calculators', path: '/test-duration-calc' },
    { id: 'effect-detection-calc', label: 'Effect Detection Calculator', group: 'Calculators', path: '/effect-detection-calc' },
    { id: 'test-results-calc', label: 'Test Results Calculator', group: 'Calculators', path: '/test-results-calc' },
    { id: 'nhst', label: 'Significance Testing', group: 'Understanding & Simulators', path: '/nhst' },
    { id: 'peeking', label: 'Peeking Simulator', group: 'Understanding & Simulators', path: '/peeking' },
    { id: 'guardrails', label: 'Guardrails Simulator', group: 'Understanding & Simulators', path: '/guardrails' },
    { id: 'imbalanced', label: 'Imbalanced Flights', group: 'Understanding & Simulators', path: '/imbalanced' },
    { id: 'cuped', label: 'CUPED Variance Reduction', group: 'Understanding & Simulators', path: '/cuped' },
    { id: 'fwer', label: 'Family-Wise Error Rate', group: 'Understanding & Simulators', path: '/fwer' },
    { id: 'winsorizing', label: 'Winsorizing Simulator', group: 'Understanding & Simulators', path: '/winsorizing' },
    { id: 'normalisation', label: 'Normalisation Simulator', group: 'Understanding & Simulators', path: '/normalisation' },
    { id: 'glossary', label: 'Glossary', group: null, path: '/glossary' },
    { id: 'feedback', label: 'Feedback & Enquiries', group: null, path: '/feedback' },
  ];

  const currentPath = location.pathname;

  return (
    <>
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 hover:bg-[#0017D2] transition-colors"
          title="Go to Home"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Menu Toggle */}
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

      {/* Menu Drawer */}
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
                const isActive = currentPath === page.path;
                if (page.group && pages[pages.indexOf(page) - 1]?.group !== page.group) {
                  return (
                    <div key={`group-${page.group}`}>
                      <p className="text-xs font-semibold text-gray-400 px-4 py-2 mt-3 mb-1 uppercase tracking-wider">
                        {page.group}
                      </p>
                      <button
                        onClick={() => { navigate(page.path); setIsOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          isActive
                            ? 'bg-[#0017D2] text-white font-semibold'
                            : 'hover:bg-gray-700 text-gray-200'
                        }`}
                      >
                        {page.label}
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={page.id}
                    onClick={() => { navigate(page.path); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      isActive
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
