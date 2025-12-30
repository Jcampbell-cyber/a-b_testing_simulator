import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  term: string;
  definition: string;
  inline?: boolean;
}

export function Tooltip({ term, definition, inline = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      setPosition(spaceBelow < 150 && spaceAbove > spaceBelow ? 'bottom' : 'top');
    }
  }, [isVisible]);

  if (inline) {
    return (
      <span className="relative inline-block">
        <span
          ref={triggerRef}
          className="border-b-2 border-dotted border-[#0017D2] cursor-help text-white"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
          tabIndex={0}
        >
          {term}
        </span>
        {isVisible && (
          <div
            ref={tooltipRef}
            className={`absolute z-50 w-64 px-3 py-2 text-sm text-white bg-gray-800 border border-gray-600 rounded-lg shadow-xl ${
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            } left-1/2 transform -translate-x-1/2`}
          >
            <div className="font-semibold mb-1 text-[#0017D2]">{term}</div>
            <div className="text-gray-300 leading-relaxed">{definition}</div>
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 border-gray-600 rotate-45 ${
                position === 'top' ? 'border-b border-r -bottom-1' : 'border-t border-l -top-1'
              }`}
            />
          </div>
        )}
      </span>
    );
  }

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center gap-1 text-[#0017D2] hover:text-blue-400 transition-colors"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 px-3 py-2 text-sm text-white bg-gray-800 border border-gray-600 rounded-lg shadow-xl ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } right-0`}
        >
          <div className="font-semibold mb-1 text-[#0017D2]">{term}</div>
          <div className="text-gray-300 leading-relaxed">{definition}</div>
          <div
            className={`absolute right-4 w-2 h-2 bg-gray-800 border-gray-600 rotate-45 ${
              position === 'top' ? 'border-b border-r -bottom-1' : 'border-t border-l -top-1'
            }`}
          />
        </div>
      )}
    </span>
  );
}
