// Runs after `vite build`: writes a full HTML file for every page into dist/,
// plus sitemap.xml, so the sitemap always matches the pages that exist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, routes, SITE_URL } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8');

for (const url of routes) {
  const { html, head } = await render(url);
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  // /pricing -> pricing.html, served at /pricing by Vercel's cleanUrls
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`;
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
  console.log(`prerendered ${url} -> dist/${file}`);
}

const sitemapUrls = routes
  .filter(url => url !== '/404')
  .map(url => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);
console.log(`wrote dist/sitemap.xml (${routes.length - 1} pages)`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
