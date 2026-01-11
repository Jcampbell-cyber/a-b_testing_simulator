import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './gtag';
import { pages } from './components/Navigation';

export function GAListener() {
  const location = useLocation();

  useEffect(() => {
    // find the page label from your navigation pages array
    const page = pages.find(p => 
      p.id === location.pathname.replace('/', '') || (location.pathname === '/' && p.id === 'landing')
    );

    const title = page ? page.label : 'A/B Test Guardrail Simulator';

    // update browser tab
    document.title = title;

    // send GA4 page_view
    pageview(location.pathname, title);
  }, [location]);

  return null;
}
