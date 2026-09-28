// Renders a page to HTML at build time (see scripts/prerender.mjs), so search
// engines and link previews get the full page content without running JavaScript.
// Not part of the browser bundle, so fast refresh rules don't apply.
/* eslint-disable react-refresh/only-export-components */
import { renderToReadableStream } from 'react-dom/server.browser';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App';
import { resourcePages, resourcePath, sectionPath, sections } from './content/resources';

export { SITE_URL } from './site';

/** Every page to pre-render. The 404 page is written to 404.html. */
export const routes = [
  '/',
  '/pricing',
  '/lessons',
  '/contact',
  '/resources',
  ...sections.map(s => sectionPath(s.id)),
  ...resourcePages.map(resourcePath),
  '/404',
];

export async function render(url: string): Promise<{ html: string; head: string }> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const stream = await renderToReadableStream(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  // Wait for lazily loaded pages so the output holds the full content, not the loading spinner
  await stream.allReady;
  const html = await new Response(stream).text();

  const h = helmetContext.helmet!;
  const head = [h.title, h.meta, h.link, h.script].map(tag => tag.toString()).join('\n    ');
  return { html, head };
}
