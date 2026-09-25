import { Link } from 'react-router-dom';
import { RESOURCES_LABEL, SITE_NAME, SITE_TAGLINE } from '../../site';
import { Container } from './ui';

const columns = [
  {
    title: RESOURCES_LABEL,
    links: [
      { label: 'Calculators', to: '/resources/calculators' },
      { label: 'Experiment best practices', to: '/resources/best-practices' },
      { label: 'Advanced techniques', to: '/resources/advanced-techniques' },
      { label: 'Glossary', to: '/resources/glossary' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Lessons', to: '/lessons' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/#about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="pb-12 pt-16 lg:pt-[72px]">
      <Container className="flex flex-col gap-12 md:flex-row md:justify-between">
        <div className="flex max-w-[320px] flex-col gap-2.5">
          <span className="font-display text-xl font-semibold text-white">{SITE_NAME}</span>
          <span className="text-[15px] leading-normal text-gray-400">{SITE_TAGLINE}</span>
        </div>
        <div className="flex flex-wrap gap-x-[72px] gap-y-10">
          {columns.map(col => (
            <div key={col.title} className="flex flex-col gap-2.5 text-[15px]">
              <div className="font-bold text-white">{col.title}</div>
              {col.links.map(link => (
                <Link key={link.label} to={link.to} className="text-gray-300 no-underline hover:text-blue-300">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <Container className="mt-12">
        <p className="border-t border-gray-800 pt-6 text-sm text-gray-400">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
