import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for HouseHoldTalent.",
};

export default function TermsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: March 2026
        </p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using HouseHoldTalent (&quot;the Platform&quot;),
              you agree to be bound by these Terms of Service. If you do not
              agree, you may not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              2. Description of Service
            </h2>
            <p>
              HouseHoldTalent is a platform that connects employers seeking
              domestic staff with candidates offering their services. We
              facilitate introductions but do not employ, endorse, or guarantee
              any candidate or employer.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              3. User Accounts
            </h2>
            <p>
              You must provide accurate information when creating an account.
              You are responsible for maintaining the security of your account
              credentials. You must be at least 18 years old to use the Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              4. Subscriptions and Payments
            </h2>
            <p>
              Paid subscriptions are billed on a recurring basis. You may
              cancel at any time, and your subscription will remain active
              until the end of the current billing period. No refunds are
              provided for partial periods.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              5. User Conduct
            </h2>
            <p>
              Users agree not to misuse the Platform, post false information,
              harass other users, or use the Platform for any unlawful purpose.
              We reserve the right to suspend or terminate accounts that
              violate these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              6. Limitation of Liability
            </h2>
            <p>
              HouseHoldTalent is provided &quot;as is&quot; without warranties
              of any kind. We are not liable for any disputes, damages, or
              losses arising from the use of the Platform or from interactions
              between employers and candidates.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              7. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of
              the Platform after changes constitutes acceptance of the updated
              Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              8. Contact
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:hello@householdtalent.com"
                className="text-primary hover:text-primary/80"
              >
                hello@householdtalent.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
