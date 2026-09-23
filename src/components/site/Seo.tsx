import { Helmet } from 'react-helmet-async';
import { canonical, pageTitle } from '../../site';

/** Page title, description and canonical URL. Pass `title` without the brand; it is appended. */
export function Seo({
  title,
  description,
  path,
  noindex = false,
}: {
  title?: string;
  description: string;
  path: string;
  noindex?: boolean;
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
      {noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
}
