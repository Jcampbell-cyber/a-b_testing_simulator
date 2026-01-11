import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { path: "/", label: "Home" },
    { path: "/sample-size-calc", label: "Sample Size Calculator" },
    { path: "/test-duration-calc", label: "Test Duration Calculator" },
    { path: "/effect-detection-calc", label: "Effect Detection Calculator" },
    { path: "/test-results-calc", label: "Test Results Calculator" },
    { path: "/nhst", label: "Significance Testing" },
    { path: "/peeking", label: "Peeking Simulator" },
    { path: "/guardrails", label: "Guardrails Simulator" },
    { path: "/imbalanced", label: "Imbalanced Flights" },
    { path: "/cuped", label: "CUPED Variance Reduction" },
    { path: "/fwer", label: "Family-Wise Error Rate" },
    { path: "/winsorizing", label: "Winsorizing Simulator" },
    { path: "/normalisation", label: "Normalisation Simulator" },
    { path: "/glossary", label: "Glossary" },
    { path: "/feedback", label: "Feedback & Enquiries" },
  ];

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 hover:bg-[#0017D2]"
        >
          <Home className="w-6 h-6 text-white" />
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 p-3 rounded-lg"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed top-20 right-4 bg-gray-800 p-4 z-50 rounded-lg w-64 max-h-[70vh] overflow-y-auto">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="block px-4 py-2 rounded-md hover:bg-gray-700 text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              {page.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
