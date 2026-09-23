import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { canonical } from '../../site';
import { getSection, resourcePath, sectionPath, type ResourcePage } from '../../content/resources';
import { CtaButton } from './CtaButton';
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
  const crumbs: { label: string; to?: string }[] = [{ label: 'Resources', to: '/resources' }];
  if (page.section) {
    const section = getSection(page.section);
    crumbs.push({ label: section.shortTitle, to: sectionPath(section.id) });
  }
  if (page.key === 'bootstrap-ab') crumbs.push({ label: 'Bootstrapping', to: '/resources/advanced-techniques/bootstrap' });
  crumbs.push({ label: page.title });

  return (
    <>
      <Helmet>
        <link rel="canonical" href={canonical(resourcePath(page))} />
      </Helmet>
      <Breadcrumbs items={crumbs} />
      {children}
      <PlanCallout location={`resource:${page.key}`} />
    </>
  );
}
