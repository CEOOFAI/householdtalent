import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Terms & Conditions",
  description:
    "Candidate Terms and Conditions for Household Talent. Terms governing candidate use of the platform.",
};

export default function CandidateTermsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          Candidate Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: March 2026
        </p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              1. Platform Role
            </h2>
            <p>
              We connect candidates with households. We do not employ candidates
              or act as an intermediary in any employment relationship.
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
              Profiles may be shared with clients for recruitment purposes.
              Candidate information is confidential and must only be used by
              clients for recruitment in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              4. Paid Services
            </h2>
            <p>
              Paid services, including Premium Profile upgrades, are
              non-refundable once delivered.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              5. Conduct
            </h2>
            <p>
              Professional behaviour is required at all times, including during
              communications and interviews. Any inappropriate behaviour may
              result in removal from the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              6. Liability
            </h2>
            <p>
              We are not responsible for employment outcomes, client conduct, or
              any disputes arising between candidates and clients.
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
