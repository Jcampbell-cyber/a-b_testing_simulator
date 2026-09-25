import { Link } from 'react-router-dom';
import { CtaButton } from '../components/site/CtaButton';
import { CtaBand } from '../components/site/CtaBand';
import { Seo } from '../components/site/Seo';
import { Container, Eyebrow, H2, Lead, Section, SectionIntro } from '../components/site/ui';
import { FREE_PLAN_TURNAROUND, LOGO_URL, SITE_NAME, SITE_URL } from '../site';
import { lessons } from '../content/lessons';
import { lessonIllustrations } from '../content/lessonIllustrations';

function Dots() {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      <div className="h-2 w-2 rounded bg-gray-600" />
      <div className="h-2 w-2 rounded bg-gray-600" />
      <div className="h-2 w-2 rounded bg-gray-600" />
    </div>
  );
}

/** Decorative "Version A vs Version B" illustration from the design */
function HeroVisual() {
  return (
    <div className="flex flex-1 flex-col gap-5" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5">
        {/* Version A */}
        <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-700 px-3.5 py-2.5">
            <Dots />
            <div className="text-[13px] font-bold text-gray-400">Version A</div>
          </div>
          <div className="flex h-[236px] flex-col gap-3 p-[18px]">
            <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-400">Pricing</div>
            <div className="flex flex-grow flex-col gap-2 rounded-lg border border-gray-700 bg-gray-900 p-3.5">
              <div className="text-[13px] font-semibold text-gray-300">Standard</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[26px] font-bold text-white">$49</span>
                <span className="text-xs text-gray-400">/month</span>
              </div>
              <div className="h-2 w-[85%] rounded-[3px] bg-gray-700" />
              <div className="h-2 w-[65%] rounded-[3px] bg-gray-700" />
              <div className="mt-auto rounded-md bg-gray-600 py-[7px] text-center text-xs font-semibold text-white">Buy now</div>
            </div>
          </div>
        </div>

        {/* Version B */}
        <div className="overflow-hidden rounded-xl border-2 border-blue-600 bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-700 px-3.5 py-2.5">
            <Dots />
            <div className="text-[13px] font-bold text-blue-400">Version B</div>
          </div>
          <div className="flex h-[236px] flex-col gap-3 p-[18px]">
            <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-400">Pricing</div>
            <div className="flex flex-grow gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-blue-600 bg-gray-900 p-3">
                <div className="self-start whitespace-nowrap rounded-full bg-blue-600 px-[7px] py-0.5 text-[10px] font-bold text-white">
                  Most popular
                </div>
                <div className="text-xs font-semibold text-gray-300">Standard</div>
                <div className="flex items-baseline gap-[3px]">
                  <span className="text-xl font-bold text-white">$49</span>
                  <span className="text-[11px] text-gray-400">/mo</span>
                </div>
                <div className="mt-auto rounded-md bg-blue-600 py-1.5 text-center text-[11px] font-semibold text-white">Buy now</div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-gray-700 bg-gray-900 p-3">
                <div className="text-xs font-semibold text-gray-300">Premium</div>
                <div className="flex items-baseline gap-[3px]">
                  <span className="text-xl font-bold text-white">$89</span>
                  <span className="text-[11px] text-gray-400">/mo</span>
                </div>
                <div className="h-2 w-4/5 rounded-[3px] bg-gray-700" />
                <div className="mt-auto rounded-md border border-gray-600 py-1.5 text-center text-[11px] font-semibold text-gray-300">
                  Choose
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col gap-3.5 rounded-xl border border-gray-700 bg-gray-800 px-[22px] py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-bold text-white">Revenue per visitor</div>
          <div className="rounded-full bg-emerald-400/[0.14] px-2.5 py-1 text-[13px] font-semibold text-emerald-400">
            B is a real winner, not luck
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[72px] text-[13px] text-gray-400">Version A</div>
          <div className="h-3.5 flex-1 rounded-[7px] bg-gray-700">
            <div className="h-3.5 w-[58%] rounded-[7px] bg-gray-600" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[72px] text-[13px] text-gray-400">Version B</div>
          <div className="h-3.5 flex-1 rounded-[7px] bg-gray-700">
            <div className="h-3.5 w-[76%] rounded-[7px] bg-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

const icon = {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#60A5FA',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const risks = [
  {
    title: 'Redesigns that backfire',
    body: 'A fresh look can drop sales for months before anyone connects the dots.',
    icon: (
      <svg {...icon}>
        <path d="M3 17 L9 11 L13 15 L21 7" />
        <path d="M15 7 H21 V13" />
      </svg>
    ),
  },
  {
    title: '“Best practices” that don’t fit',
    body: 'What worked for another business may not work for your customers.',
    icon: (
      <svg {...icon}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9 L15 15 M15 9 L9 15" />
      </svg>
    ),
  },
  {
    title: 'Decisions by hunch',
    body: 'The loudest opinion wins the meeting. Your customers never got a vote.',
    icon: (
      <svg {...icon}>
        <circle cx="12" cy="12" r="8" />
        <path d="M9.5 9.5 C9.5 7 14.5 7 14.5 9.5 C14.5 11.5 12 11.5 12 13.5" />
        <path d="M12 16.5 V16.6" />
      </svg>
    ),
  },
];

const steps = [
  { title: 'Show two versions', body: 'Half your visitors see the current page, half see the new idea. Nobody notices a thing.' },
  { title: 'Measure what matters', body: 'Sales, sign-ups, enquiries: the outcome your business actually runs on, not vanity clicks.' },
  { title: 'Keep what really wins', body: 'We only call a winner when the numbers prove it’s real, not a lucky week.' },
];

const rigour = [
  {
    title: 'Tests sized before they start',
    body: 'You know upfront how many visitors a test needs and how long it will run.',
    method: 'Sample size, power & minimum detectable effect',
  },
  {
    title: 'Answers with less traffic',
    body: 'Advanced methods cut the noise, so smaller sites reach a clear result sooner.',
    method: 'Variance reduction (CUPED)',
  },
  {
    title: 'No false winners',
    body: 'Checking early or testing many things at once creates fake wins. We correct for both.',
    method: 'Sequential & multiple-comparison corrections',
  },
  {
    title: 'Nothing quietly breaks',
    body: 'One huge order can’t fake a result, and we watch the numbers a change could harm.',
    method: 'Outlier handling & guardrail metrics',
  },
];

const workSteps = [
  {
    title: 'Get 3 free test ideas',
    free: true,
    body: 'A scan of your site for revenue leaks, three ranked ideas, and an honest note on whether your traffic can measure each.',
  },
  {
    title: 'Talk it through',
    body: 'A short call to agree your goals, the number that matters most, and which test to run first.',
  },
  {
    title: 'Set up tracking and your dashboard',
    body: 'Testing software and screen recordings installed, plus a live dashboard of your key numbers. Nothing for you to buy or set up.',
  },
  {
    title: 'Find the opportunities',
    body: 'We dig into your data and watch real visitors use your site to find where sales are being lost.',
  },
  {
    title: 'Run the test properly',
    body: 'Sample size and length planned before it starts, safety checks while it runs, and a weekly check-in.',
  },
  {
    title: 'Get a clear answer, then repeat',
    body: 'A plain-English verdict on whether the result is real, what it means for your revenue, and the next test to run.',
  },
];

const homeJsonLd = [
  {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description: 'Website testing (A/B testing and conversion rate optimisation) for small online businesses.',
    address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressRegion: 'VIC', addressCountry: 'AU' },
    areaServed: { '@type': 'Country', name: 'Australia' },
  },
  {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
];

export function HomePage() {
  return (
    <>
      <Seo
        title="Website A/B Testing & CRO in Australia"
        path="/"
        description="Melbourne-based A/B testing and conversion rate optimisation for small online businesses across Australia. We find where you lose sales, test the fixes and prove what works."
        jsonLd={homeJsonLd}
      />

      {/* HERO */}
      <section className="pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-[88px]">
        <Container className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:gap-7">
            <Eyebrow>A/B testing and CRO for Australian online businesses</Eyebrow>
            <h1 className="m-0 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.01em] sm:text-[3.25rem] lg:text-[3.875rem] lg:leading-[1.05]">
              Stop guessing what works on your website.
            </h1>
            <p className="m-0 max-w-[520px] text-lg leading-normal text-gray-300 sm:text-xl lg:text-[1.3125rem]">
              Your prices, your plans, your checkout: every change either grows revenue or quietly costs you. Testing tells you
              which, before you commit.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <CtaButton location="home-hero" size="lg" />
              <Link to="/lessons" className="text-[17px] font-semibold text-blue-400 no-underline hover:text-blue-300">
                See what testing taught us →
              </Link>
            </div>
            <div className="text-[15px] text-gray-400">Free, no obligation. Three test ideas for your site, ranked by likely impact.</div>
          </div>
          <HeroVisual />
        </Container>
      </section>

      {/* WHY TEST */}
      <Section id="why" alt containerClassName="flex flex-col gap-10 lg:gap-12">
        <SectionIntro>
          <H2>Every website change is a bet. Most businesses never check if it paid off.</H2>
          <Lead>
            A new homepage, a different checkout, a pop-up offer. They all feel like improvements. Some are. Some quietly cost
            you customers. Without testing, you never find out which.
          </Lead>
        </SectionIntro>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-7">
          {risks.map(r => (
            <div key={r.title} className="flex flex-col gap-3 rounded-[14px] bg-gray-700 p-7">
              {r.icon}
              <h3 className="m-0 text-[21px] font-bold text-white">{r.title}</h3>
              <p className="m-0 text-[17px] leading-normal text-gray-300">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW TESTING WORKS */}
      <Section id="how" containerClassName="flex flex-col gap-10 lg:gap-12">
        <SectionIntro>
          <H2>How testing works</H2>
          <Lead>
            The idea is simple. Getting a trustworthy answer isn’t. Stop a test too early or measure the wrong number, and you’ll
            confidently roll out a change that loses money.
          </Lead>
        </SectionIntro>
        <ol className="m-0 grid list-none grid-cols-1 gap-10 p-0 md:grid-cols-3 md:gap-7">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-display text-[22px] font-semibold text-white">
                {i + 1}
              </div>
              <h3 className="m-0 text-[22px] font-bold text-white">{s.title}</h3>
              <p className="m-0 text-[17px] leading-normal text-gray-300">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* RIGOUR */}
      <Section id="rigour" alt containerClassName="flex flex-col gap-10 lg:flex-row lg:gap-[72px]">
        <div className="flex flex-col gap-[18px] lg:w-[400px] lg:flex-none">
          <Eyebrow>Why work with us</Eyebrow>
          <H2>Run by data scientists, not guesswork.</H2>
          <Lead>Most testing tools will happily call a winner after a few days. Many of those wins disappear once they go live.</Lead>
          <Lead>
            We use the same statistically rigorous methods as the world’s biggest experimentation teams, and explain every result
            in plain English.
          </Lead>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {rigour.map(r => (
            <div key={r.title} className="flex flex-col gap-2.5 rounded-[14px] bg-gray-700 p-7">
              <h3 className="m-0 text-[21px] font-bold text-white">{r.title}</h3>
              <p className="m-0 text-[17px] leading-normal text-gray-300">{r.body}</p>
              <div className="mt-auto pt-1 text-[13px] font-semibold tracking-[0.04em] text-emerald-400">{r.method}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* LESSONS */}
      <Section id="lessons" containerClassName="flex flex-col gap-10 lg:gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <SectionIntro className="max-w-[700px]">
            <H2>What testing taught us</H2>
            <Lead>Real lessons from real experiments. Each one is a reason not to trust your gut alone.</Lead>
          </SectionIntro>
          <Link to="/lessons" className="whitespace-nowrap text-[17px] font-semibold text-blue-400 no-underline hover:text-blue-300">
            Read all lessons →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-7">
          {lessons.map(l => {
            const Illustration = lessonIllustrations[l.id];
            return (
              <Link
                key={l.id}
                to={`/lessons#${l.id}`}
                className="group flex flex-col gap-4 rounded-[14px] border border-gray-700 bg-gray-800 p-5 no-underline transition-colors hover:border-blue-600 lg:p-6"
              >
                <div className="rounded-[10px] border border-gray-700 bg-gray-900 p-3">
                  <Illustration />
                </div>
                <div className="flex flex-col gap-3 px-2 pb-2">
                  <h3 className="m-0 font-display text-[25px] font-semibold leading-[1.2] text-white">{l.title}</h3>
                  <p className="m-0 text-[17px] leading-normal text-gray-300">{l.summary}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* WORKING TOGETHER */}
      <section id="about" className="pb-16 pt-16 sm:pt-20 lg:pb-24 lg:pt-24">
        <Container className="flex flex-col gap-10 lg:flex-row lg:gap-[72px]">
          <div className="flex flex-col gap-4 lg:w-[380px] lg:flex-none">
            <H2>How we’d work together</H2>
            <Lead>Based in Melbourne, no lock-in contracts. Start with a free plan and decide from there.</Lead>
            <Link to="/pricing" className="text-[17px] font-semibold text-blue-400 no-underline hover:text-blue-300">
              See full pricing and what’s included →
            </Link>
          </div>
          <ol className="m-0 flex flex-1 list-none flex-col border-b border-gray-700 p-0">
            {workSteps.map((step, i) => (
              <li key={step.title} className="flex gap-5 border-t border-gray-700 py-[26px] sm:gap-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-blue-600 font-display text-lg font-semibold text-blue-400">
                  {i + 1}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="m-0 text-xl font-bold text-white">{step.title}</h3>
                    {step.free && (
                      <span className="rounded-full bg-emerald-400/[0.14] px-2.5 py-0.5 text-[13px] font-semibold text-emerald-400">Free</span>
                    )}
                  </div>
                  <p className="m-0 text-[17px] leading-normal text-gray-300">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand title="Find out what your website could be doing better." location="home-final">
        Send us your site. You’ll get three ranked test ideas within {FREE_PLAN_TURNAROUND}. Free, no obligation.
      </CtaBand>
    </>
  );
}
