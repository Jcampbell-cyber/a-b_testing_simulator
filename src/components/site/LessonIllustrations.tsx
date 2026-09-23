import type { ReactNode } from 'react';

// Illustrations for the three lessons. Qualitative: they show the shape of
// each story, not real figures. Colours: blue = the thing being tested,
// green = the outcome that matters, grey = everything else.
const C = {
  frame: '#111827',
  panel: '#374151',
  line: '#4B5563',
  muted: '#9CA3AF',
  text: '#D1D5DB',
  white: '#FFFFFF',
  blue: '#60A5FA',
  blueFill: '#2563EB',
  green: '#34D399',
};

function Svg({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <svg
      viewBox="0 0 360 230"
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
      className="block h-auto w-full"
      fontFamily="'Source Sans 3', 'Helvetica Neue', sans-serif"
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      {children}
    </svg>
  );
}

/** A tiny browser window with a sign-up prompt placed inside it */
function PageFrame({ x, label, variant }: { x: number; label: string; variant: 'home' | 'search' | 'product' }) {
  const w = 100;
  return (
    <g transform={`translate(${x} 22)`}>
      <text x={w / 2} y={-8} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.text}>
        {label}
      </text>
      <rect width={w} height={96} rx="7" fill={C.frame} stroke={C.line} />
      <circle cx="9" cy="9" r="2" fill={C.line} />
      <circle cx="16" cy="9" r="2" fill={C.line} />
      <circle cx="23" cy="9" r="2" fill={C.line} />
      <line x1="0" y1="17" x2={w} y2="17" stroke={C.line} />

      {variant === 'home' && (
        <>
          <rect x="10" y="26" width="56" height="6" rx="2" fill={C.panel} />
          <rect x="10" y="37" width="40" height="5" rx="2" fill={C.panel} />
          <rect x="10" y="52" width="80" height="32" rx="5" fill="none" stroke={C.blue} strokeWidth="1.5" />
          <rect x="18" y="60" width="44" height="5" rx="2" fill={C.blue} opacity="0.6" />
          <rect x="18" y="71" width="30" height="7" rx="3" fill={C.blueFill} />
        </>
      )}
      {variant === 'search' && (
        <>
          {[26, 40, 68].map(y => (
            <g key={y}>
              <rect x="10" y={y} width="16" height="10" rx="2" fill={C.panel} />
              <rect x="31" y={y + 1} width="54" height="4" rx="2" fill={C.panel} />
              <rect x="31" y={y + 7} width="34" height="3" rx="1.5" fill={C.panel} />
            </g>
          ))}
          <rect x="10" y="54" width="80" height="10" rx="3" fill="none" stroke={C.blue} strokeWidth="1.2" />
          <rect x="15" y="57.5" width="38" height="3" rx="1.5" fill={C.blue} opacity="0.6" />
          <rect x="10" y="84" width="80" height="4" rx="2" fill={C.panel} />
        </>
      )}
      {variant === 'product' && (
        <>
          <rect x="10" y="25" width="34" height="34" rx="4" fill={C.panel} />
          <rect x="50" y="27" width="40" height="5" rx="2" fill={C.panel} />
          <rect x="50" y="37" width="24" height="7" rx="2" fill={C.muted} opacity="0.5" />
          <rect x="50" y="49" width="40" height="8" rx="3" fill={C.line} />
          <rect x="10" y="66" width="80" height="22" rx="5" fill="none" stroke={C.blue} strokeWidth="1.5" />
          <rect x="16" y="71" width="36" height="4" rx="2" fill={C.blue} opacity="0.6" />
          <rect x="16" y="79" width="26" height="6" rx="3" fill={C.blueFill} />
        </>
      )}
    </g>
  );
}

function Arrow({ x }: { x: number }) {
  return (
    <path
      d={`M${x} 70 h14 m-5 -5 l5 5 l-5 5`}
      fill="none"
      stroke={C.muted}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function LessonOneIllustration() {
  const baseline = 196;
  const bars = [
    { x: 6, h: 44, label: 'Worked too', note: 'nobody predicted this' },
    { x: 130, h: 5, label: 'Ignored', note: 'busy searching' },
    { x: 254, h: 52, label: 'Sign-ups rose', note: 'close to their goal' },
  ];
  return (
    <Svg
      title="Same sign-up prompt on three pages"
      desc="Visitors move from the homepage to search results to a product page. The same create-an-account prompt was ignored on search results, raised sign-ups on the product page, and unexpectedly also worked on the homepage."
    >
      <PageFrame x={6} label="Homepage" variant="home" />
      <Arrow x={111} />
      <PageFrame x={130} label="Search results" variant="search" />
      <Arrow x={235} />
      <PageFrame x={254} label="Product page" variant="product" />

      <text x="6" y="136" fontSize="11" fill={C.muted}>Sign-ups from the prompt</text>
      <line x1="6" y1={baseline} x2="354" y2={baseline} stroke={C.line} />
      {bars.map(b => (
        <g key={b.label}>
          <rect x={b.x + 30} y={baseline - b.h} width="40" height={b.h} rx="4" fill={C.blue} />
          <text x={b.x + 50} y={baseline + 14} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.white}>
            {b.label}
          </text>
          <text x={b.x + 50} y={baseline + 27} textAnchor="middle" fontSize="10.5" fill={C.muted}>
            {b.note}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function LessonTwoIllustration() {
  const x0 = 12;
  const x1 = 348;
  const change = 96;
  const rows = [
    {
      label: 'Left immediately',
      note: 'sharp jump',
      color: C.muted,
      y: 58,
      d: `M${x0} 30 L${change} 30 L${change + 10} 8 L${x1} 10`,
    },
    {
      label: 'Came back and signed in',
      note: 'many returned',
      color: C.blue,
      y: 122,
      d: `M${x0} 30 L${change} 30 C${change + 60} 30 ${change + 110} 6 ${x1} 4`,
    },
    {
      label: 'Completed purchases',
      note: 'no change',
      color: C.green,
      y: 186,
      d: `M${x0} 18 L${x1} 18`,
    },
  ];
  return (
    <Svg
      title="Visitors followed for four weeks after sign-in became mandatory"
      desc="After sign-in was made mandatory, the number of visitors leaving immediately jumped. Over the following weeks many of them came back and signed in, and completed purchases stayed flat the whole time."
    >
      <line x1={change} y1="18" x2={change} y2="206" stroke={C.muted} strokeDasharray="3 4" />
      <text x={change + 6} y="14" fontSize="11" fontWeight="600" fill={C.text}>Sign-in made mandatory</text>
      {rows.map(r => (
        <g key={r.label} transform={`translate(0 ${r.y - 22})`}>
          <text x={x0} y="-4" fontSize="12" fontWeight="600" fill={C.white}>{r.label}</text>
          <text x={x1} y="-4" textAnchor="end" fontSize="11" fill={C.muted}>{r.note}</text>
          <line x1={x0} y1="36" x2={x1} y2="36" stroke={C.panel} />
          <path d={r.d} fill="none" stroke={r.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {['Before', 'Week 1', 'Week 2', 'Week 3', 'Week 4'].map((t, i) => (
        <text key={t} x={i === 0 ? 40 : change + 40 + (i - 1) * 62} y="223" textAnchor="middle" fontSize="10.5" fill={C.muted}>
          {t}
        </text>
      ))}
    </Svg>
  );
}

export function LessonThreeIllustration() {
  const base = 176;
  return (
    <Svg
      title="A 20% drop in a small slice barely moves the whole site"
      desc="Inside the test, activity in one small slice fell by 20%. Across the whole site that slice is a small share, so total revenue barely moves."
    >
      {/* Inside the test */}
      <text x="10" y="18" fontSize="12" fontWeight="600" fill={C.white}>Inside the test</text>
      <text x="10" y="33" fontSize="10.5" fill={C.muted}>one small slice of activity</text>
      <line x1="10" y1={base} x2="150" y2={base} stroke={C.line} />
      <rect x="26" y={base - 110} width="42" height="110" rx="4" fill={C.blue} opacity="0.45" />
      <rect x="92" y={base - 88} width="42" height="88" rx="4" fill={C.blue} />
      <text x="47" y={base + 16} textAnchor="middle" fontSize="11" fill={C.muted}>Before</text>
      <text x="113" y={base + 16} textAnchor="middle" fontSize="11" fill={C.muted}>After</text>
      <text x="113" y={base - 96} textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="20" fontWeight="600" fill={C.white}>
        −20%
      </text>
      <text x="80" y="214" textAnchor="middle" fontSize="11.5" fontWeight="600" fill={C.text}>Looks alarming</text>

      <line x1="172" y1="10" x2="172" y2="220" stroke={C.panel} />

      {/* Whole site */}
      <text x="190" y="18" fontSize="12" fontWeight="600" fill={C.white}>Across the whole site</text>
      <text x="190" y="33" fontSize="10.5" fill={C.muted}>total revenue</text>
      {[
        { y: 70, label: 'Before', slice: 22 },
        { y: 126, label: 'After', slice: 17.6 },
      ].map(row => (
        <g key={row.label}>
          <text x="190" y={row.y - 8} fontSize="11" fill={C.muted}>{row.label}</text>
          <rect x="190" y={row.y} width="136" height="24" rx="4" fill={C.line} />
          <rect x="328" y={row.y} width={row.slice} height="24" rx="4" fill={C.blue} opacity={row.label === 'Before' ? 0.45 : 1} />
        </g>
      ))}
      <rect x="190" y="166" width="10" height="10" rx="2" fill={C.line} />
      <text x="205" y="175" fontSize="10.5" fill={C.muted}>rest of the business</text>
      <rect x="190" y="183" width="10" height="10" rx="2" fill={C.blue} />
      <text x="205" y="192" fontSize="10.5" fill={C.muted}>the affected slice</text>
      <text x="270" y="214" textAnchor="middle" fontSize="11.5" fontWeight="600" fill={C.text}>Barely moves</text>
    </Svg>
  );
}

