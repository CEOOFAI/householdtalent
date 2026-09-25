import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for HouseHoldTalent (HHT). How we collect, use and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: September 2026
        </p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              1. Introduction
            </h2>
            <p>
              HouseHoldTalent (&quot;HHT&quot;) is committed to protecting your privacy and
              handling your personal data with discretion and care.
            </p>
            <p className="mt-2">
              This Privacy Policy explains how we collect, use, and protect your
              information when using our platform.
            </p>
            <p className="mt-2">
              HouseHoldTalent is operated by Norry Holdings Limited (Gibraltar).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              2. Data We Collect
            </h2>
            <p>
              We collect personal data necessary to provide access to the
              platform and facilitate introductions. This may include:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Personal details (name, contact information)</li>
              <li>Profile information (experience, skills, preferences)</li>
              <li>CVs and supporting documents</li>
              <li>Police-check documents, where you choose to provide them</li>
              <li>Platform usage data</li>
            </ul>
            <p className="mt-2">
              We only collect information that is relevant to the operation of
              the service.
            </p>
            <p className="mt-2">
              Where a police-check document is provided, it is reviewed by our
              team and then deleted. We record only the outcome and the date of
              the review.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              3. How We Use Your Data
            </h2>
            <p>We use your data to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide and manage your account</li>
              <li>Facilitate introductions between candidates and employers</li>
              <li>Improve the platform and user experience</li>
              <li>
                Communicate with you regarding your account or enquiries
              </li>
            </ul>
            <p className="mt-2">
              We do not use your data for unrelated marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              4. Legal Basis for Processing
            </h2>
            <p>
              We process personal data under the following legal bases:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Contractual necessity — to provide access to the platform
              </li>
              <li>
                Legitimate interest — to operate, improve, and secure the
                platform
              </li>
              <li>Consent — where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              5. Data Sharing
            </h2>
            <p>Your data may be shared in the following ways:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Anonymised candidate profile summaries may be shown to registered
                employers. Identifying details are released only with the
                candidate&apos;s consent, through an HHT-facilitated introduction
              </li>
              <li>
                Information may be shared with trusted service providers (e.g.
                hosting, infrastructure) strictly to operate the platform
              </li>
            </ul>
            <p className="mt-2">
              We do not sell personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              6. Data Retention
            </h2>
            <p>
              We retain personal data only for as long as necessary to provide
              our services or comply with legal obligations.
            </p>
            <p className="mt-2">
              Users may request deletion of their data at any time. Inactive
              accounts may be removed after a reasonable period.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              7. International Data Transfers
            </h2>
            <p>
              Due to the nature of our platform, your data may be processed in
              different jurisdictions.
            </p>
            <p className="mt-2">
              We take appropriate measures to ensure your data remains protected
              in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              8. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access your personal data</li>
              <li>Correct or update your information</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Request transfer of your data (data portability)</li>
              <li>
                Lodge a complaint with a relevant data protection authority
              </li>
            </ul>
            <p className="mt-2">
              You may also update your information at any time through your
              account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              9. Data Security
            </h2>
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal data.
            </p>
            <p className="mt-2">
              Given the nature of private household environments, we place
              particular importance on discretion, confidentiality, and secure
              handling of information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              10. Cookies
            </h2>
            <p>
              We may use cookies or similar technologies to improve platform
              performance and user experience.
            </p>
            <p className="mt-2">
              Further details can be provided upon request.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">
              11. Contact
            </h2>
            <p>
              For privacy-related enquiries or data requests, please contact:{" "}
              <a
                href="mailto:hello@householdtalent.com"
                className="text-primary hover:text-primary/80"
              >
                hello@householdtalent.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
