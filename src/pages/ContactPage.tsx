import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Seo } from '../components/site/Seo';
import { Container, Eyebrow } from '../components/site/ui';
import { FORMSPREE_FORM_ID, FREE_PLAN_TURNAROUND } from '../site';
import { trackContactSubmitted, useCta } from '../lib/analytics';

const interests = [
  { value: 'free', label: 'A free testing plan' },
  { value: 'one-off', label: 'A one-off test' },
  { value: 'ongoing', label: 'Ongoing testing' },
  { value: 'other', label: 'Something else' },
];

const nextSteps = [
  'Send us your site and a little about your business.',
  'We scan it for revenue leaks and look at what your traffic can measure.',
  `Within ${FREE_PLAN_TURNAROUND}, you get three test ideas ranked by likely impact.`,
];

const field =
  'w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-base text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40';
const labelCls = 'mb-2 block text-[15px] font-semibold text-white';

export default function ContactPage() {
  const [params] = useSearchParams();
  const cta = useCta();
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const [networkError, setNetworkError] = useState(false);
  const tracked = useRef(false);

  const initialPlan = interests.some(i => i.value === params.get('plan')) ? params.get('plan')! : 'free';
  const [interest, setInterest] = useState(initialPlan);
  const source = params.get('from') ?? 'direct';

  useEffect(() => {
    if (state.succeeded && !tracked.current) {
      tracked.current = true;
      trackContactSubmitted({ interest, source, cta_variant: cta.variant });
    }
  }, [state.succeeded, interest, source, cta.variant]);

  return (
    <>
      <Seo
        title="Get a free testing plan"
        path="/contact"
        description={`Send us your site. You’ll get three ranked test ideas within ${FREE_PLAN_TURNAROUND}. Free, no obligation.`}
      />

      <section className="py-12 sm:py-16 lg:py-[88px]">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="m-0 text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              Get your free testing plan
            </h1>
            <p className="m-0 max-w-[520px] text-lg leading-normal text-gray-300 lg:text-xl">
              Send us your site. You’ll get three ranked test ideas within {FREE_PLAN_TURNAROUND}. Free, no obligation.
            </p>
            <ol className="m-0 mt-2 flex list-none flex-col gap-5 p-0">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 font-display text-lg font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-[17px] leading-normal text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
            <p className="m-0 text-[15px] text-gray-400">
              Asking about a paid plan or something else? Use the same form and we’ll get back to you.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 sm:p-8">
            {state.succeeded ? (
              <div className="flex flex-col items-start gap-4 py-6" role="status">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" aria-hidden="true" />
                <h2 className="m-0 text-3xl font-semibold">Thanks, we’ve got it.</h2>
                <p className="m-0 text-lg leading-normal text-gray-300">
                  {interest === 'free'
                    ? `We’ll take a look at your site and send your three ranked test ideas within ${FREE_PLAN_TURNAROUND}.`
                    : `We’ll be in touch within ${FREE_PLAN_TURNAROUND}.`}
                </p>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  setNetworkError(false);
                  handleSubmit(e).catch(() => setNetworkError(true));
                }}
                className="flex flex-col gap-6"
              >
                <input type="hidden" name="_subject" value={`New enquiry: ${interests.find(i => i.value === interest)?.label}`} />
                <input type="hidden" name="source" value={source} />
                <input type="hidden" name="cta_variant" value={cta.variant} />
                {/* Spam trap: real people never fill this in */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>Your name</label>
                    <input id="name" name="name" type="text" required autoComplete="name" className={field} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>Email</label>
                    <input id="email" name="email" type="email" required autoComplete="email" className={field} />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-2 text-sm text-red-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="website" className={labelCls}>Your website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      inputMode="url"
                      required
                      autoComplete="url"
                      placeholder="yourshop.com"
                      className={field}
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className={labelCls}>
                      Mobile <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <input id="mobile" name="mobile" type="tel" autoComplete="tel" className={field} />
                  </div>
                </div>

                <div>
                  <label htmlFor="interest" className={labelCls}>What are you interested in?</label>
                  <select
                    id="interest"
                    name="interest"
                    value={interest}
                    onChange={e => setInterest(e.target.value)}
                    className={field}
                  >
                    {interests.map(i => (
                      <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelCls}>
                    Anything we should know? <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="What do you sell, and what would you most like to improve?"
                    className={`${field} resize-y`}
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-2 text-sm text-red-400" />
                </div>

                {(networkError || (state.errors && !state.submitting)) && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-700 bg-red-900/30 p-4" role="alert">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
                    <p className="m-0 text-red-200">Something went wrong sending your details. Please check the form and try again.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="inline-flex w-full items-center justify-center rounded-[10px] bg-blue-600 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                  {state.submitting ? 'Sending…' : interest === 'free' ? 'Send me my free plan' : 'Send enquiry'}
                </button>
                <p className="m-0 text-center text-sm text-gray-400">We only use your details to reply to you.</p>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
