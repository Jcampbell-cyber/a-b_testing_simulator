import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './gtag';
import { pages } from './components/Navigation';

export function GAListener() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;

    // only fire if path changed
    if (lastPathRef.current === path) return;

    lastPathRef.current = path;

    const page = pages.find(
      p =>
        p.id === path.replace('/', '') ||
        (path === '/' && p.id === 'landing')
    );

    const title = page ? page.label : 'A/B Test Guardrail Simulator';

    document.title = title;

    if (typeof window !== 'undefined' && window.gtag) {
      pageview(path, title);
    }
  }, [location]);

  return null;
}
