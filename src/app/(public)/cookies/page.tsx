import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How HouseHoldTalent uses cookies and similar technologies, what data is collected, and how to manage your preferences.',
}

const LAST_UPDATED = 'September 2026'

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
        Cookie Policy
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-invert mt-10 space-y-8 text-neutral-300">
        <section>
          <h2 className="font-heading text-xl text-white">What cookies are</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Cookies are small text files that a website stores on your device.
            They let the site remember things about your visit — such as keeping
            you signed in, or measuring which pages are useful. Some cookies are
            essential for the site to work. Others are optional and you can
            decline them.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-white">Cookies we use</h2>

          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900 text-left text-xs uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="p-3">Cookie</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Lifetime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                <tr>
                  <td className="p-3 font-mono text-xs text-white">sb-*-auth-token</td>
                  <td className="p-3 text-neutral-400">
                    Keeps you signed in (Supabase auth session)
                  </td>
                  <td className="p-3 text-neutral-400">Essential</td>
                  <td className="p-3 text-neutral-400">1 hour, refreshed</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs text-white">hht_cookie_consent_v1</td>
                  <td className="p-3 text-neutral-400">
                    Remembers your cookie choice so the banner does not reappear
                  </td>
                  <td className="p-3 text-neutral-400">Essential</td>
                  <td className="p-3 text-neutral-400">Until you clear it</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs text-white">_vercel_*</td>
                  <td className="p-3 text-neutral-400">
                    Vercel Web Analytics — anonymised page views and performance
                  </td>
                  <td className="p-3 text-neutral-400">Analytics</td>
                  <td className="p-3 text-neutral-400">1 year</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs text-white">__stripe_*</td>
                  <td className="p-3 text-neutral-400">
                    Fraud prevention at checkout (only set when you reach
                    payment screens)
                  </td>
                  <td className="p-3 text-neutral-400">Payments</td>
                  <td className="p-3 text-neutral-400">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl text-white">Your choices</h2>
          <p className="mt-3 text-sm leading-relaxed">
            When you first visit the site you can choose to accept all cookies or
            essential cookies only. Your choice is stored in your browser
            (localStorage). You can change your mind at any time by clearing your
            browser data for this site — the banner will reappear on your next
            visit.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            You can also block or delete cookies directly in your browser
            settings. Note that blocking essential cookies will sign you out and
            stop the site from working as intended.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-white">Third parties</h2>
          <p className="mt-3 text-sm leading-relaxed">
            We use the following third-party services that may set their own
            cookies:
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <span className="text-white">Supabase</span> — authentication and
              database. Privacy:{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9B7B3C] hover:underline"
              >
                supabase.com/privacy
              </a>
            </li>
            <li>
              <span className="text-white">Vercel</span> — hosting and
              analytics. Privacy:{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9B7B3C] hover:underline"
              >
                vercel.com/legal/privacy-policy
              </a>
            </li>
            <li>
              <span className="text-white">Stripe</span> — payments. Privacy:{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9B7B3C] hover:underline"
              >
                stripe.com/privacy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl text-white">Contact</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Questions about cookies or your data? See our{' '}
            <Link href="/privacy" className="text-[#9B7B3C] hover:underline">
              Privacy Policy
            </Link>{' '}
            or get in touch via the{' '}
            <Link href="/contact" className="text-[#9B7B3C] hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
