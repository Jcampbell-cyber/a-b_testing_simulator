import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Seo } from '../components/site/Seo';
import { PlanCallout } from '../components/site/ResourceLayout';
import { Container } from '../components/site/ui';
import { pagesInSection, resourcePages, resourcePath, sectionPath, sections } from '../content/resources';
import { sectionIcons } from '../content/sectionIcons';

export default function ResourcesPage() {
  const glossary = resourcePages.find(p => p.key === 'glossary')!;

  return (
    <>
      <Seo
        title="Resources"
        path="/resources"
        description="Free testing calculators, interactive simulators on experiment best practices, and advanced techniques used by experienced experimentation teams."
      />

      <section className="pb-12 pt-12 sm:pt-16 lg:pb-16 lg:pt-[88px]">
        <Container className="flex flex-col gap-5">
          <div className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-400">Resources</div>
          <h1 className="m-0 max-w-[820px] text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
            Free tools for testing properly
          </h1>
          <p className="m-0 max-w-[640px] text-lg leading-normal text-gray-300 lg:text-xl">
            The calculators and simulators we use to plan and check experiments. Free to use, no sign-up.
          </p>
        </Container>
      </section>

      <section className="border-y border-gray-700 bg-gray-800 py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {sections.map(section => {
            const Icon = sectionIcons[section.id];
            return (
              <div key={section.id} className="flex flex-col gap-5 rounded-2xl bg-gray-700 p-7">
                <div className="flex flex-col gap-3">
                  <Icon className="h-8 w-8 text-blue-400" strokeWidth={1.8} aria-hidden="true" />
                  <h2 className="m-0 text-[1.75rem] font-semibold leading-tight">
                    <Link to={sectionPath(section.id)} className="text-white no-underline hover:text-blue-300">
                      {section.title}
                    </Link>
                  </h2>
                  <p className="m-0 text-base leading-normal text-gray-300">{section.description}</p>
                </div>
                <ul className="m-0 flex list-none flex-col border-l border-gray-600 p-0">
                  {pagesInSection(section.id).map(page => (
                    <li key={page.key}>
                      <Link
                        to={resourcePath(page)}
                        className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-[17px] text-gray-200 no-underline hover:border-blue-400 hover:text-white"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={sectionPath(section.id)}
                  className="mt-auto inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-400 no-underline hover:text-blue-300"
                >
                  View all {section.shortTitle.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </Container>
      </section>

      <section className="pt-12 lg:pt-16">
        <Container>
          <Link
            to={resourcePath(glossary)}
            className="flex items-center gap-4 rounded-2xl border border-gray-700 p-6 no-underline hover:border-blue-600 sm:p-7"
          >
            <BookOpen className="h-7 w-7 shrink-0 text-blue-400" strokeWidth={1.8} aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-white">{glossary.title}</span>
              <span className="text-base text-gray-300">{glossary.description}</span>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <PlanCallout location="resources-hub" />
    </>
  );
}
