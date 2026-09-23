import type { ReactNode } from 'react';
import { CtaButton } from './CtaButton';
import { Container } from './ui';

/** Big blue call-to-action panel that closes most pages */
export function CtaBand({
  title,
  children,
  location,
  buttonVariant = 'dark',
}: {
  title: string;
  children: ReactNode;
  location: string;
  buttonVariant?: 'dark' | 'light';
}) {
  return (
    <Container>
      <section
        id="cta"
        className="flex flex-col items-center gap-[22px] rounded-[20px] bg-blue-600 px-6 py-14 text-center sm:px-12 lg:p-[72px]"
      >
        <h2 className="m-0 max-w-[760px] text-[2rem] font-semibold leading-[1.1] text-white sm:text-[2.5rem] lg:text-[2.875rem]">
          {title}
        </h2>
        <p className="m-0 max-w-[600px] text-lg leading-[1.55] text-white lg:text-[1.1875rem]">{children}</p>
        <CtaButton location={location} variant={buttonVariant} size="lg" className="font-bold" />
      </section>
    </Container>
  );
}
