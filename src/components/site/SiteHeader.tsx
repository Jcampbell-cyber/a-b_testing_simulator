import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { CtaButton } from './CtaButton';
import { Container } from './ui';
import { cx } from '../../lib/cx';

const navItems = [
  { label: 'How it works', to: '/#how' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Resources', to: '/resources' },
  { label: 'About', to: '/#about' },
];

function isActive(to: string, pathname: string) {
  if (to.includes('#')) return false;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname, hash]);

  // Lock page scroll behind the open mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-700 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/85">
      <Container className="flex h-[76px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 text-base lg:flex xl:gap-9">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              aria-current={isActive(item.to, pathname) ? 'page' : undefined}
              className={cx(
                'no-underline hover:text-blue-300',
                isActive(item.to, pathname) ? 'text-blue-400' : 'text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
          <CtaButton location="header" size="md" />
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <CtaButton location="header-mobile" size="sm" className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700 text-white hover:bg-gray-800"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-76px)] overflow-y-auto border-t border-gray-700 bg-gray-900 lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {navItems.map(item => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cx(
                  'rounded-lg px-3 py-3.5 text-lg no-underline hover:bg-gray-800 hover:text-white',
                  isActive(item.to, pathname) ? 'text-blue-400' : 'text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
            <CtaButton location="mobile-menu" size="lg" className="mt-4 w-full" onClick={() => setOpen(false)} />
          </Container>
        </div>
      )}
    </header>
  );
}
