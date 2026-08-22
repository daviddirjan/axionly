/**
 * Single source of truth for values that were previously duplicated across
 * ~12 literal sites in both locales (prices, the LinkedIn URL, the form endpoint).
 *
 * Edit here, not in the pages.
 */

// ── Contact ──────────────────────────────────────────────────────────────────
export const EMAIL = 'hello@axionly.io';

/** Real founder profile. Do not replace with a bare linkedin.com link. */
export const LINKEDIN = 'https://www.linkedin.com/in/david-dirjan-3573561b3/';

/**
 * Public booking URL for the free 20-minute discovery call (Cal.com / Calendly).
 * BLOCKER B3 — leave empty until a real URL exists. While empty, the booking
 * sections fall back to the mailto path instead of showing a placeholder box.
 */
export const BOOKING_URL = '';

/**
 * Endpoint every form on the site POSTs to.
 *
 * BLOCKER B1 — the site is a static build with no adapter, so there is no server
 * to receive submissions. Create a free access key at https://web3forms.com and
 * paste it here. While this is empty, forms render a visible notice and fall back
 * to mailto instead of silently discarding leads.
 */
export const FORM_ENDPOINT = '';
export const FORM_PROVIDER: 'web3forms' | 'formspree' = 'web3forms';

export const formsAreLive = FORM_ENDPOINT.length > 0;

export const formAction = FORM_PROVIDER === 'web3forms'
  ? 'https://api.web3forms.com/submit'
  : `https://formspree.io/f/${FORM_ENDPOINT}`;

// ── Pricing ──────────────────────────────────────────────────────────────────
/**
 * Amounts in EUR. `en` uses the 1,234 convention, `ro` uses 1.234 (see the RO
 * style guide / DOOM3). Schema.org always gets the raw number.
 */
type Price = { raw: string; en: string; ro: string };

const price = (raw: string, en: string, ro: string): Price => ({ raw, en, ro });

export const PRICES = {
  /** BLOCKER B4 — plan-suggested figure, not yet founder-confirmed. */
  readiness:  price('450',  '€450',   '450 €'),
  assessment: price('2500', '€2,500', '2.500 €'),
  deepDive:   price('3200', '€3,200', '3.200 €'),
} as const;

export const DELIVERY = {
  readiness:  { en: '3 business days', ro: '3 zile lucrătoare' },
  assessment: { en: '5 business days', ro: '5 zile lucrătoare' },
} as const;

/**
 * Window in which the Readiness Check fee is credited against a full assessment.
 * Referenced in the offer copy in both languages — keep them in sync.
 */
export const CREDIT_WINDOW_DAYS = 60;
