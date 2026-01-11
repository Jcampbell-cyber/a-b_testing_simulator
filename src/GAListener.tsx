import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './gtag';
import { pages } from './Navigation';

export function GAListener() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    let path = location.pathname;

    // normalize path: remove trailing slash except for root
    if (path.endsWith('/') && path !== '/') {
      path = path.slice(0, -1);
    }

    // skip duplicate pageviews
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    // find page label from pages array
    const page = pages.find(
      p =>
        p.id === path.replace('/', '') ||
        (path === '/' && p.id === 'landing')
    );

    const title = page ? page.label : 'A/B Test Guardrail Simulator';

    // update browser tab
    document.title = title;

    // fire GA4 pageview
    if (typeof window !== 'undefined' && window.gtag) {
      pageview(path, title);
    }
  }, [location]);

  return null;
}
