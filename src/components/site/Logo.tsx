import { Link } from 'react-router-dom';
import { SITE_NAME } from '../../site';
import { cx } from '../../lib/cx';

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cx('flex h-7 w-7 items-center justify-center rounded-[7px] bg-blue-600', className)} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <path d="M3 12 L7 7 L10 9 L13 4" />
      </svg>
    </span>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 text-white no-underline hover:text-white">
      <LogoMark />
      <span className="font-display text-[22px] font-semibold">{SITE_NAME}</span>
    </Link>
  );
}
