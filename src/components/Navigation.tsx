import { useState } from 'react';
import { Menu, Home, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { id: 'landing', label: 'Home' },
    { id: 'nhst', label: 'Significance Testing' },
    { id: 'peeking', label: 'Peeking Simulator' },
    { id: 'guardrails', label: 'Guardrails Simulator' },
    { id: 'fwer', label: 'Family-Wise Error Rate' },
    { id: 'imbalanced', label: 'Imbalanced Flights' },
    { id: 'cuped', label: 'CUPED Variance Reduction' },
    { id: 'feedback', label: 'Feedback & Enquiries' },
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

          <div className="fixed top-20 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 z-50 w-64">
            <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
            <nav className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onNavigate(page.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentPage === page.id
                      ? 'bg-[#0017D2] text-white font-semibold'
                      : 'hover:bg-gray-100 text-white'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
