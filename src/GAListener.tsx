import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './gtag';
import { pages } from './components/Navigation'; // adjust if in same folder

export function GAListener() {
  const location = useLocation();

  useEffect(() => {
    const page = pages.find(
      p => (location.pathname === '/' && p.id === 'landing') || p.id === location.pathname.replace('/', '')
    );

    const title = page ? page.label : 'A/B Test Guardrail Simulator';

    document.title = title;

    try {
      pageview(location.pathname, title);
    } catch {
      console.warn('GA not initialized yet');
    }
  }, [location]);

  return null;
}
