import { Helmet } from 'react-helmet-async';
import { canonical, OG_IMAGE, pageTitle } from '../../site';
import type { JsonLd } from '../../lib/structuredData';

/**
 * Page title, description, canonical URL, social sharing tags and optional
 * structured data. Pass `title` without the brand; it is appended.
 */
export function Seo({
  title,
  description,
  path,
  noindex = false,
  jsonLd,
}: {
  title?: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** schema.org objects, rendered as one JSON-LD graph */
  jsonLd?: JsonLd[];
}) {
  const fullTitle = pageTitle(title);
  const url = canonical(path);
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {jsonLd && jsonLd.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd })}
        </script>
      )}
    </Helmet>
  );
}
