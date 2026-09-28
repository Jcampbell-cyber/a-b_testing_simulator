import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';

// Example tests shown in a swipeable carousel under "How testing works".
// Illustrative, not client results. Each slide is a mini A vs B plus the outcome.

type Tone = 'good' | 'bad' | 'flat';

interface Example {
  shop: string;
  test: string;
  change: string;
  a: ReactNode;
  b: ReactNode;
  results: { label: string; value: string; tone: Tone }[];
}

function Frame({ label, winner, children }: { label: string; winner?: boolean; children: ReactNode }) {
  return (
    <div
      className={cx(
        'flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-gray-900',
        winner ? 'border-2 border-blue-600' : 'border border-gray-700'
      )}
    >
      <div className={cx('border-b border-gray-700 px-3 py-1.5 text-[11px] font-bold', winner ? 'text-blue-400' : 'text-gray-400')}>
        {label}
      </div>
      <div className="flex min-h-[164px] flex-1 flex-col gap-2 p-2.5 sm:p-3">{children}</div>
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <div className="text-xs font-semibold text-white">{children}</div>;
}

function Price({ children }: { children: ReactNode }) {
  return <div className="text-xl font-bold text-white">{children}</div>;
}

function Button({ primary }: { primary?: boolean }) {
  return (
    <div className={cx('mt-auto rounded-md py-1.5 text-center text-[11px] font-semibold text-white', primary ? 'bg-blue-600' : 'bg-gray-600')}>
      Add to cart
    </div>
  );
}

function Row({ left, right, on }: { left: ReactNode; right: string; on?: boolean }) {
  return (
    <div
      className={cx(
        'flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-[11px]',
        on ? 'border-blue-600 bg-blue-600/10 text-white' : 'border-gray-700 text-gray-300'
      )}
    >
      <span className="min-w-0">{left}</span>
      <span className="font-bold text-white">{right}</span>
    </div>
  );
}

function Lines() {
  return (
    <>
      <div className="h-1.5 w-4/5 rounded-sm bg-gray-700" />
      <div className="h-1.5 w-3/5 rounded-sm bg-gray-700" />
    </>
  );
}

const examples: Example[] = [
  {
    shop: 'Skincare',
    test: 'Multi-buy price ladder',
    change: 'A single price became a choice of 1, 2 or 3, with 2 marked most popular.',
    a: (
      <>
        <Title>Vitamin C serum 30ml</Title>
        <Price>$45</Price>
        <Lines />
        <Button />
      </>
    ),
    b: (
      <>
        <Title>Vitamin C serum 30ml</Title>
        <Row left="Buy 1" right="$45" />
        <Row left={<>Buy 2 <span className="text-blue-400">· popular</span></>} right="$80" on />
        <Row left="Buy 3" right="$108" />
        <Button primary />
      </>
    ),
    results: [
      { label: 'Buyers', value: 'no real change', tone: 'flat' },
      { label: 'Revenue per visitor', value: '+24%', tone: 'good' },
    ],
  },
  {
    shop: 'Candles',
    test: 'Raise the price',
    change: 'The same candle, $4 dearer. Fewer people bought it, but the shop made more.',
    a: (
      <>
        <Title>Soy candle, fig and cedar</Title>
        <Price>$34</Price>
        <Lines />
        <Button />
      </>
    ),
    b: (
      <>
        <Title>Soy candle, fig and cedar</Title>
        <Price>$38</Price>
        <Lines />
        <Button primary />
      </>
    ),
    results: [
      { label: 'Buyers', value: '−5%', tone: 'bad' },
      { label: 'Revenue per visitor', value: '+6%', tone: 'good' },
    ],
  },
  {
    shop: 'Pet supplies',
    test: 'Free-shipping progress bar',
    change: 'The cart shows how close shoppers are to free shipping, with one add-on to get there.',
    a: (
      <>
        <Title>Your cart</Title>
        <Row left="Kibble 3kg" right="$46" />
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>Shipping</span>
          <span>$9.95</span>
        </div>
        <Button />
      </>
    ),
    b: (
      <>
        <div className="text-[11px] text-gray-300">
          <span className="font-semibold text-blue-400">$14</span> to free shipping
        </div>
        <div className="h-1.5 rounded-sm bg-gray-700">
          <div className="h-1.5 w-[77%] rounded-sm bg-blue-500" />
        </div>
        <Row left="Kibble 3kg" right="$46" />
        <div className="flex items-center justify-between rounded-md border border-dashed border-gray-600 px-2 py-1 text-[11px] text-gray-400">
          <span>Chews · $15</span>
          <span className="font-semibold text-blue-400">+ Add</span>
        </div>
        <Button primary />
      </>
    ),
    results: [
      { label: 'Average order', value: '$48 → $56', tone: 'good' },
      { label: 'Revenue per visitor', value: '+15%', tone: 'good' },
    ],
  },
  {
    shop: 'Activewear',
    test: 'Add a premium option',
    change: 'A $149 pair appeared next to the $89 pair. Few bought it, but it made $89 look like good value.',
    a: (
      <>
        <Title>Everyday leggings</Title>
        <Price>$89</Price>
        <Lines />
        <Button />
      </>
    ),
    b: (
      <>
        <Title>Leggings</Title>
        <Row left="Everyday" right="$89" on />
        <Row left="Pro" right="$149" />
        <Lines />
        <Button primary />
      </>
    ),
    results: [
      { label: 'Pro pair', value: 'few sales', tone: 'flat' },
      { label: 'Everyday sales', value: '+11%', tone: 'good' },
    ],
  },
];

const toneClass: Record<Tone, string> = {
  good: 'bg-emerald-400/[0.14] text-emerald-400',
  bad: 'bg-amber-400/[0.14] text-amber-400',
  flat: 'bg-gray-700 text-gray-300',
};

function Arrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous example' : 'Next example'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 text-white transition-colors hover:border-blue-500 disabled:opacity-40 disabled:hover:border-gray-600"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === 'prev' ? <path d="M15 5 L8 12 L15 19" /> : <path d="M9 5 L16 12 L9 19" />}
      </svg>
    </button>
  );
}

export function TestExamples() {
  const track = useRef<HTMLDivElement>(null);
  // Which slides are mostly on screen, and whether the track is at either end
  const [visible, setVisible] = useState<boolean[]>(() => examples.map((_, i) => i === 0));
  const [edges, setEdges] = useState({ start: true, end: false });

  const slideWidth = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + parseFloat(getComputedStyle(el!).columnGap || '0') : 0;
  };

  const goTo = (i: number) => track.current?.scrollTo({ left: i * slideWidth(), behavior: 'smooth' });
  const step = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * slideWidth(), behavior: 'smooth' });

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    setVisible(
      [...el.children].map(child => {
        const r = child.getBoundingClientRect();
        const shown = Math.min(r.right, box.right) - Math.max(r.left, box.left);
        return shown / r.width > 0.6;
      })
    );
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    onScroll();
    window.addEventListener('resize', onScroll);
    return () => window.removeEventListener('resize', onScroll);
  }, []);

  return (
    <div className="flex flex-col gap-6" role="region" aria-roledescription="carousel" aria-label="Example tests">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="m-0 text-[22px] font-bold text-white">Tests we’d run on a shop like yours</h3>
          <p className="m-0 text-[15px] text-gray-400">Examples of the kind of result testing uncovers.</p>
        </div>
        <div className="hidden flex-none gap-2 sm:flex">
          <Arrow dir="prev" onClick={() => step(-1)} disabled={edges.start} />
          <Arrow dir="next" onClick={() => step(1)} disabled={edges.end} />
        </div>
      </div>

      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 sm:mx-0 sm:scroll-px-0 sm:px-0"
      >
        {examples.map((ex, i) => (
          <div
            key={ex.test}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${examples.length}: ${ex.test}`}
            className="flex w-[90%] flex-none snap-start flex-col gap-4 rounded-[14px] border border-gray-700 bg-gray-800 p-4 sm:w-[62%] sm:p-5 lg:w-[45%] lg:p-6"
          >
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-400">{ex.shop}</div>
              <div className="text-xl font-bold text-white">{ex.test}</div>
            </div>
            <div className="flex gap-2 sm:gap-3" aria-hidden="true">
              <Frame label="Version A">{ex.a}</Frame>
              <Frame label="Version B" winner>
                {ex.b}
              </Frame>
            </div>
            <p className="m-0 text-[15px] leading-normal text-gray-300">{ex.change}</p>
            <div className="mt-auto flex flex-wrap gap-2">
              {ex.results.map(r => (
                <div key={r.label} className={cx('rounded-full px-2.5 py-1 text-[13px] font-semibold', toneClass[r.tone])}>
                  {r.label}: {r.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {examples.map((ex, i) => (
          <button
            key={ex.test}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show example ${i + 1}: ${ex.test}`}
            aria-current={visible[i]}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span className={cx('h-2 rounded-full transition-all', visible[i] ? 'w-5 bg-blue-500' : 'w-2 bg-gray-600')} />
          </button>
        ))}
      </div>
    </div>
  );
}
