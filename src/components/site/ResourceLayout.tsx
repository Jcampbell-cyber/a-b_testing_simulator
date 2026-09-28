import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { canonical, PRICES, RESOURCES_LABEL, SITE_NAME, SITE_URL } from '../../site';
import { getSection, resourcePath, sectionPath, type ResourcePage } from '../../content/resources';
import { CtaButton } from './CtaButton';
import { Seo } from './Seo';
import { breadcrumbJsonLd } from '../../lib/structuredData';
import { Container } from './ui';

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-gray-800">
      <Container>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-4 text-sm">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4 text-gray-600" aria-hidden="true" />}
              {item.to ? (
                <Link to={item.to} className="text-gray-400 no-underline hover:text-blue-300">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-semibold text-white">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}

/** "Not sure what's worth testing?" card shown at the end of every resource page */
export function PlanCallout({ location }: { location: string }) {
  return (
    <Container className="pb-4 pt-12 lg:pt-16">
      <aside className="flex flex-col gap-5 rounded-2xl border border-gray-700 bg-gray-800 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex flex-col gap-1.5">
          <p className="m-0 font-display text-2xl font-semibold text-white">Not sure what's worth testing on your site?</p>
          <p className="m-0 text-base text-gray-300">
            Get three ranked test ideas for your site. Free, no obligation.
          </p>
        </div>
        <CtaButton location={location} className="shrink-0" />
      </aside>
    </Container>
  );
}

export function ResourceLayout({ page, children }: { page: ResourcePage; children: ReactNode }) {
  const crumbs: { label: string; to?: string }[] = [{ label: RESOURCES_LABEL, to: '/resources' }];
  if (page.section) {
    const section = getSection(page.section);
    crumbs.push({ label: section.shortTitle, to: sectionPath(section.id) });
  }
  if (page.key === 'bootstrap-ab') crumbs.push({ label: 'Bootstrapping', to: '/resources/advanced-techniques/bootstrap' });
  crumbs.push({ label: page.title });

  const path = resourcePath(page);
  const jsonLd = [breadcrumbJsonLd(crumbs, path)];
  // The calculators and simulators are free web tools
  if (page.section) {
    jsonLd.push({
      '@type': 'WebApplication',
      name: page.seoTitle,
      description: page.seoDescription,
      url: canonical(path),
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: PRICES.currency },
      provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    });
  }

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path={path} jsonLd={jsonLd} />
      <Breadcrumbs items={crumbs} />
      {children}
      <PlanCallout location={`resource:${page.key}`} />
    </>
  );
}
