import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

/** Centred content column matching the 1280px design, with mobile-first gutters */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-site px-5 sm:px-8 lg:px-12 xl:px-20', className)}>{children}</div>;
}

/** Full-width section. `alt` gives the #1F2937 alternate background with hairline borders. */
export function Section({
  id,
  alt = false,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  alt?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(alt ? 'border-y border-gray-700 bg-gray-800' : 'bg-gray-900', 'py-16 sm:py-20 lg:py-24', className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('text-sm font-semibold uppercase tracking-[0.08em] text-blue-400', className)}>{children}</div>
  );
}

export function H2({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={cx('m-0 text-[2rem] font-semibold leading-[1.1] sm:text-[2.5rem] lg:text-[2.75rem]', className)}>
      {children}
    </h2>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('m-0 text-lg leading-[1.55] text-gray-300 lg:text-[1.1875rem]', className)}>{children}</p>;
}

export function SectionIntro({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('flex max-w-[760px] flex-col gap-4', className)}>{children}</div>;
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#34D399"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cx('mt-[3px] shrink-0', className)}
    >
      <path d="M5 12.5 L10 17 L19 7" />
    </svg>
  );
}
