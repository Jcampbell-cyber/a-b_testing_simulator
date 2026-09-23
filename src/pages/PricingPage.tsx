import { CtaBand } from '../components/site/CtaBand';
import { CtaButton } from '../components/site/CtaButton';
import { Seo } from '../components/site/Seo';
import { CheckIcon, Container, H2 } from '../components/site/ui';
import { cx } from '../lib/cx';
import { PRICES } from '../site';

const plans = [
  {
    id: 'free',
    name: 'Free testing plan',
    price: '$0',
    unit: '',
    blurb: 'See where your site is leaking revenue before you spend a cent.',
    features: [
      'Quick scan of your site for revenue leaks',
      'Three ranked test ideas',
      'Honest note on whether your traffic can measure each idea',
      'No obligation',
    ],
    button: 'Get your free plan',
    featured: false,
  },
  {
    id: 'one-off',
    name: 'One-off test',
    price: PRICES.oneOff,
    unit: 'one test',
    blurb: 'One experiment, run end to end. A good way to see how testing works.',
    features: [
      'Opportunity finding: we analyse your data and watch screen recordings of real visitors to find where you’re losing sales',
      'Testing software and screen recordings included, nothing extra to buy',
      'Test designed with sample size and duration planned upfront',
      'Setup and monitoring, with safety checks on key metrics',
      'Weekly check-ins',
      'Final report with clear recommendations',
      'Learnings and next test ideas',
    ],
    button: 'Start a test',
    featured: false,
  },
  {
    id: 'ongoing',
    name: 'Ongoing testing',
    price: PRICES.ongoing,
    unit: '/ month',
    blurb: 'A continuous testing programme. Every result feeds the next test.',
    features: [
      'Everything in the one-off test, running continuously',
      'Up to 2 tests live at a time, as many as your traffic can support',
      'Ongoing opportunity finding and recommendations',
      'Testing software and screen recordings included, nothing extra to buy',
      'Weekly check-ins',
      'Report for every finished test',
      'Monthly summary of learnings and revenue impact',
      'Cancel any time with 30 days’ notice',
    ],
    button: 'Start ongoing testing',
    featured: true,
  },
];

const faqs = [
  {
    q: 'Why is ongoing testing better value?',
    a: `A one-off test gives you one answer. Ongoing testing builds on every result, so each test is smarter than the last. For ${PRICES.ongoing} a month, you get a steady pipeline of experiments, with up to 2 running at once, instead of a single test for ${PRICES.oneOff}.`,
  },
  {
    q: 'How long does a test take?',
    a: 'Usually 4 to 6 weeks on a smaller site. A test needs enough visitors to tell a real improvement from luck. We calculate the right length before starting, so you know upfront.',
  },
  {
    q: 'Why cap it at 2 tests at a time?',
    a: 'Running too many tests at once on a smaller site slows every test down and lets them interfere with each other. The cap keeps your results trustworthy.',
  },
  {
    q: 'What if my site doesn’t have enough traffic?',
    a: 'We’ll tell you straight in your free testing plan, and suggest what’s worth doing at your size instead.',
  },
  {
    q: 'Do I need to buy any tools?',
    a: 'No. The testing software and screen recordings are included in every paid plan. We set everything up for you.',
  },
  {
    q: 'Who builds the test versions?',
    a: 'Whichever suits you. Your own team or developer can build them, or we can build them for you.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. Ongoing testing has no lock-in contract. Just give 30 days’ notice.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Seo
        title="Pricing"
        path="/pricing"
        description={`Simple pricing, no lock-in contracts. Start with a free testing plan, run a one-off test for ${PRICES.oneOff}, or get ongoing testing for ${PRICES.ongoing} a month.`}
      />

      {/* HEADER */}
      <section className="pb-12 pt-12 sm:pt-16 lg:pb-14 lg:pt-[88px]">
        <Container className="flex flex-col items-center gap-[18px] text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-400">Pricing</div>
          <h1 className="m-0 max-w-[820px] text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
            Simple pricing. No lock-in contracts.
          </h1>
          <p className="m-0 max-w-[640px] text-lg leading-normal text-gray-300 lg:text-xl">
            Start free. Try a single test, or get the most from testing with an ongoing programme.
          </p>
        </Container>
      </section>

      {/* PLANS */}
      <section>
        <Container className="flex flex-col gap-5">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={cx(
                  'flex flex-col gap-[18px] rounded-2xl bg-gray-800 p-7 sm:p-8',
                  plan.featured ? 'border-2 border-blue-600' : 'border border-gray-700'
                )}
              >
                {plan.featured ? (
                  <div className="self-start rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">Best value</div>
                ) : (
                  <div className="hidden h-6 lg:block" aria-hidden="true" />
                )}
                <h2 className="m-0 font-sans text-xl font-bold text-white">{plan.name}</h2>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-semibold text-white">{plan.price}</span>
                  {plan.unit && <span className="text-base text-gray-400">{plan.unit}</span>}
                </div>
                <p className="m-0 text-base leading-normal text-gray-300 lg:min-h-12">{plan.blurb}</p>
                <ul className="m-0 flex flex-grow list-none flex-col gap-3 p-0">
                  {plan.features.map(f => (
                    <li key={f} className="flex gap-2.5 text-base leading-[1.45] text-gray-300">
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <CtaButton
                  location={`pricing-${plan.id}`}
                  params={{ plan: plan.id }}
                  label={plan.button}
                  variant={plan.featured ? 'primary' : 'outline'}
                  size="lg"
                  className="mt-2 w-full text-[17px]"
                />
              </div>
            ))}
          </div>
          <div className="text-center text-[15px] text-gray-400">All prices in {PRICES.currency}.</div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container className="flex flex-col gap-8 lg:flex-row lg:gap-[72px]">
          <div className="lg:w-[380px] lg:flex-none">
            <H2>Common questions</H2>
          </div>
          <div className="flex flex-1 flex-col border-b border-gray-700">
            {faqs.map(f => (
              <div key={f.q} className="flex flex-col gap-2 border-t border-gray-700 py-6">
                <h3 className="m-0 text-xl font-bold text-white">{f.q}</h3>
                <p className="m-0 text-[17px] leading-[1.55] text-gray-300">{f.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Not sure where to start?" location="pricing-final" buttonVariant="light">
        Get your free testing plan. You’ll see exactly what we’d test first, and whether it’s worth it for your site.
      </CtaBand>
    </>
  );
}
