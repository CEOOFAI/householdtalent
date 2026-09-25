import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for HouseHoldTalent (HHT), a private talent and introduction platform for household staff.",
};

export default function TermsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: September 2026
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
              HouseHoldTalent (&quot;HHT&quot;) is a private talent and
              introduction platform for household staff. It is not a
              recruitment agency. Employers and candidates may request
              introductions, and HHT facilitates each introduction. Contact
              details are never shared automatically and are released only with
              consent. HHT is not the employer and is not a party to any
              employment contract, and does not guarantee any candidate,
              employer or outcome.
            </p>
            <p className="mt-3">
              &quot;HHT Approved&quot; means a profile has been individually
              reviewed by our team before admission. It is not a background,
              police or reference check, nor an independent verification of the
              information provided. &quot;References Checked&quot; is shown only
              where HHT has obtained referee feedback. Employers remain
              responsible for their own pre-employment checks.
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
              4. Employer Plans and Payments
            </h2>
            <p>
              Employer plans (Standard, Ongoing Hiring and Priority Search) are
              one-off, prepaid 30-day access packages. They are not
              subscriptions and do not renew automatically. Access ends at the
              close of the 30-day period, and unused time does not roll over.
              Agency partner arrangements are agreed separately. Nothing in
              these Terms affects your statutory consumer rights.
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
