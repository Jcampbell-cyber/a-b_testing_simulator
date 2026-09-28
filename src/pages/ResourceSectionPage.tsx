import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '../components/site/Seo';
import { breadcrumbJsonLd } from '../lib/structuredData';
import { Breadcrumbs, PlanCallout } from '../components/site/ResourceLayout';
import { Container } from '../components/site/ui';
import { getSection, pagesInSection, resourcePath, sectionPath, type SectionId } from '../content/resources';
import { sectionIcons } from '../content/sectionIcons';
import { RESOURCES_LABEL } from '../site';

export default function ResourceSectionPage({ sectionId }: { sectionId: SectionId }) {
  const section = getSection(sectionId);
  const Icon = sectionIcons[sectionId];
  const crumbs = [{ label: RESOURCES_LABEL, to: '/resources' }, { label: section.shortTitle }];

  return (
    <>
      <Seo
        title={section.seoTitle}
        path={sectionPath(sectionId)}
        description={section.description}
        jsonLd={[breadcrumbJsonLd(crumbs, sectionPath(sectionId))]}
      />
      <Breadcrumbs items={crumbs} />

      <section className="pb-12 pt-12 sm:pt-16 lg:pb-16 lg:pt-20">
        <Container className="flex flex-col gap-5">
          <Icon className="h-9 w-9 text-blue-400" strokeWidth={1.8} aria-hidden="true" />
          <h1 className="m-0 text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">{section.title}</h1>
          <p className="m-0 max-w-[640px] text-lg leading-normal text-gray-300 lg:text-xl">{section.description}</p>
        </Container>
      </section>

      <section className="border-y border-gray-700 bg-gray-800 py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {pagesInSection(sectionId).map(page => (
            <Link
              key={page.key}
              to={resourcePath(page)}
              className="group flex flex-col gap-3 rounded-[14px] border border-transparent bg-gray-700 p-7 no-underline transition-colors hover:border-blue-500"
            >
              <h2 className="m-0 font-sans text-[21px] font-bold text-white">{page.title}</h2>
              <p className="m-0 text-[17px] leading-normal text-gray-300">{page.description}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[15px] font-semibold text-blue-400 group-hover:text-blue-300">
                Open <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </Container>
      </section>

      <PlanCallout location={`section:${sectionId}`} />
    </>
  );
}
