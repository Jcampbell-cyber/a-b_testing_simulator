import { Link } from 'react-router-dom';
import { CtaBand } from '../components/site/CtaBand';
import { Seo } from '../components/site/Seo';
import { Container } from '../components/site/ui';
import { cx } from '../lib/cx';
import { lessons } from '../content/lessons';
import { lessonIllustrations } from '../content/lessonIllustrations';
import { CONTACT_PATH } from '../site';
import { trackCtaClick, useCta } from '../lib/analytics';

export default function LessonsPage() {
  const cta = useCta();

  return (
    <>
      <Seo
        title="A/B Testing Case Studies: What Testing Taught Us"
        path="/lessons"
        description="Real lessons from real experiments. Each one is a reason not to trust your gut alone."
      />

      <section className="pb-12 pt-12 sm:pt-16 lg:pb-16 lg:pt-[88px]">
        <Container className="flex flex-col gap-5">
          <div className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-400">Lessons</div>
          <h1 className="m-0 max-w-[820px] text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
            What testing taught us
          </h1>
          <p className="m-0 max-w-[640px] text-lg leading-normal text-gray-300 lg:text-xl">
            Real lessons from real experiments. Each one is a reason not to trust your gut alone.
          </p>
          <nav aria-label="Lessons" className="mt-4 flex flex-wrap gap-3">
            {lessons.map(l => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="rounded-full border border-gray-700 px-4 py-2 text-[15px] font-semibold text-gray-300 no-underline hover:border-blue-600 hover:text-white"
              >
                {l.title}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {lessons.map((lesson, i) => {
        const Illustration = lessonIllustrations[lesson.id];
        return (
        <article
          key={lesson.id}
          id={lesson.id}
          aria-labelledby={`${lesson.id}-title`}
          className={cx('py-16 sm:py-20 lg:py-24', i % 2 === 0 ? 'border-y border-gray-700 bg-gray-800' : 'bg-gray-900')}
        >
          <Container className="flex flex-col gap-6 lg:flex-row lg:gap-[72px]">
            <div className="flex flex-col gap-6 lg:w-[440px] lg:flex-none">
              <h2 id={`${lesson.id}-title`} className="m-0 text-[2rem] font-semibold leading-[1.12] sm:text-[2.5rem]">
                {lesson.title}
              </h2>
              <figure className={cx('m-0 rounded-2xl border border-gray-700 p-4 sm:p-5', i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800')}>
                <Illustration />
              </figure>
            </div>
            <div className="flex max-w-[680px] flex-1 flex-col gap-5">
              {lesson.paragraphs.map((p, j) => (
                <p key={j} className="m-0 text-lg leading-[1.6] text-gray-300 lg:text-[1.1875rem]">
                  {p}
                </p>
              ))}
              <Link
                to={`${CONTACT_PATH}?from=${lesson.id}`}
                onClick={() => trackCtaClick(lesson.id, cta.variant)}
                className="mt-2 text-[17px] font-semibold text-blue-400 no-underline hover:text-blue-300"
              >
                {cta.label} →
              </Link>
            </div>
          </Container>
        </article>
        );
      })}

      <div className="pt-16 lg:pt-24">
        <CtaBand title="What would your visitors choose?" location="lessons-final">
          Get your free testing plan. You’ll see exactly what we’d test first, and whether it’s worth it for your site.
        </CtaBand>
      </div>
    </>
  );
}
