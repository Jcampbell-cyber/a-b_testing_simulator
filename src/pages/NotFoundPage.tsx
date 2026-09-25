import { Link } from 'react-router-dom';
import { Seo } from '../components/site/Seo';
import { Container } from '../components/site/ui';
import { RESOURCES_LABEL } from '../site';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" path="/404" description="This page doesn’t exist." noindex />
      <section className="py-24 lg:py-32">
        <Container className="flex flex-col items-start gap-5">
          <div className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-400">404</div>
          <h1 className="m-0 text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl">We couldn’t find that page.</h1>
          <p className="m-0 max-w-[560px] text-lg text-gray-300">It may have moved. Try one of these instead.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[17px] font-semibold">
            <Link to="/" className="text-blue-400 no-underline hover:text-blue-300">Home →</Link>
            <Link to="/resources" className="text-blue-400 no-underline hover:text-blue-300">{RESOURCES_LABEL} →</Link>
            <Link to="/pricing" className="text-blue-400 no-underline hover:text-blue-300">Pricing →</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
