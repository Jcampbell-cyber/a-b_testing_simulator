// Brand and business details. Change the name here and it updates everywhere.
export const SITE_NAME = 'AdvancedAB';
export const SITE_URL = 'https://advancedab.tech';
export const SITE_TAGLINE = 'Website testing for small online businesses.';

export const CONTACT_PATH = '/contact';

// Formspree form that receives contact / free plan requests.
export const FORMSPREE_FORM_ID = 'xdakpdye';

export const PRICES = {
  oneOff: '$1,490',
  ongoing: '$1,990',
  currency: 'AUD',
};

export const FREE_PLAN_TURNAROUND = '3 business days';

export function pageTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Website testing for small online businesses`;
}

export function canonical(path: string) {
  return `${SITE_URL}${path === '/' ? '/' : path}`;
}
