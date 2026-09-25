import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Terms & Conditions",
  description:
    "Candidate Terms and Conditions for HouseHoldTalent (HHT). Terms governing candidate membership, profile visibility and HHT-facilitated introductions.",
};

export default function CandidateTermsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          Candidate Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: September 2026
        </p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              1. Platform Role
            </h2>
            <p>
              HouseHoldTalent (&quot;HHT&quot;) facilitates introductions
              between candidates and employers. HHT is not the employer and is
              not a party to any employment contract. HHT is a private talent
              and introduction platform, not a recruitment agency.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              2. Accuracy
            </h2>
            <p>
              All information provided must be truthful and up to date,
              including CV details, employment history, and references.
              Providing false or misleading information may result in immediate
              removal from the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              3. Visibility
            </h2>
            <p>
              Anonymised profile summaries may be shown to registered
              employers. Your identifying and contact details are released only
              with your consent, through an HHT-facilitated introduction.
              Candidate information is confidential and may be used by
              employers only to consider you for a role, in accordance with
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              4. Membership and Optional CV Services
            </h2>
            <p>
              Membership, including a Standard HHT Approved profile, is
              complimentary. Approved members may choose optional CV services
              (HHT CV Polish, £35, or Professional CV, £59). These are kept
              completely separate from admission, and paying for a CV has no
              effect on whether an application is approved. Once a completed
              CV has been delivered, the fee is not refundable. This does not
              affect your statutory consumer rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              5. Conduct
            </h2>
            <p>
              Professional behaviour is required at all times, including in
              communications and interviews with employers. Any inappropriate behaviour may
              result in removal from the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              6. Liability
            </h2>
            <p>
              We are not responsible for employment outcomes, employer conduct,
              or any disputes arising between candidates and employers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              7. Governing Law
            </h2>
            <p>
              These Terms are governed by Gibraltar law.
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
