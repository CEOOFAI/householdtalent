// Public site address. Set NEXT_PUBLIC_APP_URL in Vercel (e.g. to
// https://householdtalent.com once the domain is live) and every canonical
// link, sitemap entry and email link follows.
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://householdtalent.vercel.app')
  .trim()
  .replace(/\/$/, '')
