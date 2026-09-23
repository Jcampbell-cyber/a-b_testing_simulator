import { Link } from 'react-router-dom';
import { CONTACT_PATH } from '../../site';
import { trackCtaClick, useCta } from '../../lib/analytics';
import { cx } from '../../lib/cx';

const styles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 hover:text-white',
  dark: 'bg-gray-800 text-white hover:bg-gray-900 hover:text-white',
  light: 'bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900',
  outline: 'border border-gray-600 bg-transparent text-white hover:border-gray-400 hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2.5 text-[15px] rounded-lg font-semibold',
  md: 'px-5 py-3 text-base rounded-lg font-semibold',
  lg: 'px-6 py-4 text-lg rounded-[10px] font-semibold',
};

type Props = {
  /** Where on the site the button is, e.g. "home-hero". Sent to analytics and the contact form. */
  location: string;
  variant?: keyof typeof styles;
  size?: keyof typeof sizes;
  className?: string;
  /** Override the experiment wording (e.g. pricing card buttons) */
  label?: string;
  /** Extra query parameters for the contact page, e.g. { plan: 'one-off' } */
  params?: Record<string, string>;
  onClick?: () => void;
};

/** The main "Get a free testing plan" call to action. Wording comes from the PostHog experiment. */
export function CtaButton({ location, variant = 'primary', size = 'md', className, label, params, onClick }: Props) {
  const cta = useCta();
  const search = new URLSearchParams({ from: location, ...params }).toString();

  return (
    <Link
      to={`${CONTACT_PATH}?${search}`}
      onClick={() => {
        trackCtaClick(location, cta.variant);
        onClick?.();
      }}
      className={cx(
        'inline-flex items-center justify-center text-center no-underline transition-colors',
        styles[variant],
        sizes[size],
        className
      )}
    >
      {label ?? cta.label}
    </Link>
  );
}
