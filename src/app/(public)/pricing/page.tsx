import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, FileText } from "lucide-react";
import FAQAccordion from "./faq-accordion";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed-price, 30-day access to the HHT Approved network of household staff. HHT-facilitated introductions, no success fees, complete discretion. Plans from £165.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const EMPLOYER_PLANS = [
  {
    name: "Standard",
    price: "£165",
    subtitle: "30 days access",
    features: [
      "1 live role for 30 days",
      "Access to the HHT candidate network",
      "Employer and candidate introduction requests",
      "HHT-facilitated introductions",
    ],
    excluded: ["No replacement role"],
    note: "One live role for the full 30-day period.",
    cta: "Submit a Role Brief",
    popular: false,
  },
  {
    name: "Ongoing Hiring",
    price: "£295",
    subtitle: "30 days access",
    features: [
      "Everything in Standard",
      "Up to 2 live roles at any time for 30 days",
      "1 replacement role if a position is filled within the 30 days",
    ],
    excluded: [],
    note: "You browse the network and request introductions. HHT does not run an active search on this plan.",
    cta: "Submit Role Briefs",
    popular: true,
  },
  {
    name: "Priority Search",
    price: "£445",
    subtitle: "30 days access",
    features: [
      "Everything in Ongoing Hiring",
      "Priority visibility to suitable candidates",
      "Dedicated talent search",
      "Proactive candidate outreach",
      "Role-specific suitability questionnaire",
      "Professional referee feedback obtained and summarised where available",
      "Curated shortlist",
      "HHT-facilitated introductions",
    ],
    excluded: [],
    note: "HHT actively searches on your behalf and delivers a curated shortlist.",
    cta: "Request Priority Search",
    popular: false,
  },
];

type CellValue = boolean | string;

const COMPARISON_ROWS: { label: string; values: [CellValue, CellValue, CellValue] }[] = [
  { label: "Live roles", values: ["1", "Up to 2", "Up to 2"] },
  { label: "Replacement role", values: [false, "1", "1"] },
  { label: "HHT candidate network access", values: [true, true, true] },
  { label: "Introduction requests", values: [true, true, true] },
  { label: "Priority visibility to suitable candidates", values: [false, false, true] },
  { label: "Dedicated search and outreach", values: [false, false, true] },
  { label: "Suitability questionnaire", values: [false, false, true] },
  { label: "Referee feedback", values: [false, false, "Where available"] },
  { label: "Curated shortlist", values: [false, false, true] },
];

/* ------------------------------------------------------------------ */
/*  Plan Card                                                          */
/* ------------------------------------------------------------------ */

function PlanCard({ plan }: { plan: (typeof EMPLOYER_PLANS)[number] }) {
  return (
    <div
      className={`card-lift relative flex h-full flex-col rounded-2xl border bg-black p-5 sm:p-7 ${
        plan.popular
          ? "border-2 border-[#9B7B3C]/60 shadow-[0_0_30px_rgba(155,123,60,0.08)] md:shadow-[0_0_40px_rgba(155,123,60,0.12)]"
          : "border-neutral-800"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#9B7B3C] px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
          Recommended
        </span>
      )}

      <h3 className="font-heading text-lg font-semibold text-white">
        {plan.name}
      </h3>

      <div className="mt-5">
        <span className="font-heading text-4xl font-bold text-white">
          {plan.price}
        </span>
        <p className="mt-1 text-sm text-neutral-500">{plan.subtitle}</p>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
            <span className="text-sm text-neutral-300">{f}</span>
          </li>
        ))}
        {plan.excluded.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
            <span className="text-sm text-neutral-500">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <p className="text-[11px] text-neutral-500">{plan.note}</p>

        <Link
          href="/register/employer"
          className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
            plan.popular
              ? "btn-gold"
              : "border border-[#9B7B3C] text-[#9B7B3C] hover:bg-[#9B7B3C]/10"
          }`}
        >
          {plan.cta}
        </Link>
      </div>
    </div>
  );
}

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-[#9B7B3C]" aria-label="Included" />;
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-neutral-700" aria-label="Not included" />;
  }
  return <span className="text-neutral-300">{value}</span>;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ornate py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-heading text-4xl font-light text-white sm:text-5xl">
            Access exceptional household staff
          </h1>
          <p className="mt-5 text-lg text-neutral-400">
            Fixed-price access to the HouseHoldTalent (HHT) network. No success
            fees. No commission. Every introduction facilitated by HHT.
          </p>
        </div>
      </section>

      {/* Employer Plans */}
      <section className="bg-ornate px-4 pb-12 sm:px-6">
        <p className="mx-auto mb-10 max-w-5xl text-center text-sm text-neutral-500">
          Designed for private households and discreet hiring environments
        </p>

        {/* One grid: stacked in price order on mobile, 3 columns on desktop */}
        <RevealGroup stagger={90} className="mx-auto grid max-w-md items-stretch gap-5 md:max-w-5xl md:grid-cols-3">
          {EMPLOYER_PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </RevealGroup>

        {/* Comparison table */}
        <Reveal className="mx-auto mt-12 max-w-5xl">
          <h2 className="mb-5 text-center font-heading text-2xl font-light text-white">
            Compare Plans
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-black">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th scope="col" className="px-4 py-3 font-medium text-neutral-500">
                    <span className="sr-only">Feature</span>
                  </th>
                  {EMPLOYER_PLANS.map((plan) => (
                    <th
                      key={plan.name}
                      scope="col"
                      className="px-2 py-3 text-center font-heading text-sm font-semibold text-white sm:px-3 sm:text-base"
                    >
                      {plan.name}
                      <span className="block text-xs font-normal text-[#9B7B3C]">
                        {plan.price}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-neutral-900 last:border-0">
                    <th scope="row" className="px-3 py-3 font-normal text-neutral-400 sm:px-4">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className="px-2 py-3 text-center text-xs sm:px-3">
                        <ComparisonCell value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-neutral-500">
          All plans are prepaid for 30 days of access. Unused time does not
          roll over.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-ornate px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center font-heading text-3xl font-light text-white">
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
        </div>
      </section>

      {/* Candidate Pricing */}
      <section className="bg-ornate px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center font-heading text-3xl font-light text-white">
            For Candidates
          </h2>
          <p className="mb-12 text-center text-neutral-400">
            Membership is complimentary. HHT Approved means every profile is
            individually reviewed by our team before admission.
          </p>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Standard HHT Approved Profile - Complimentary */}
            <div className="rounded-2xl border-2 border-[#9B7B3C]/60 bg-black p-5 sm:p-8">
              <h3 className="font-heading text-xl font-semibold text-white">
                Standard HHT Approved Profile
              </h3>
              <div className="mt-4">
                <span className="font-heading text-4xl font-bold text-white">
                  Complimentary
                </span>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  For approved members. All applications are reviewed before
                  admission to the network.
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Submit your application and supporting CV",
                  "Individually reviewed by the HHT team",
                  "Profile (photo, job title, location, languages)",
                  "Browse suitable roles and request introductions",
                  "Details shared only with your consent",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                    <span className="text-sm text-neutral-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register/candidate"
                className="btn-gold mt-8 block w-full rounded-lg py-3 text-center text-sm"
              >
                Apply to Join
              </Link>
            </div>

            {/* Optional CV Services */}
            <div className="rounded-2xl border border-neutral-800 bg-black p-5 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#9B7B3C]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]">
                  Optional
                </span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white">
                CV Services
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Available to approved members only.
              </p>
              <ul className="mt-6 space-y-5">
                <li>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-white">HHT CV Polish</span>
                    <span className="font-heading text-2xl font-bold text-white">£35</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    Your CV professionally restructured and presented, with a
                    discreet &ldquo;Prepared by HouseHoldTalent&rdquo; footer.
                  </p>
                </li>
                <li>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-white">Professional CV</span>
                    <span className="font-heading text-2xl font-bold text-white">£59</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    Professionally restructured and presented, fully unbranded
                    for unrestricted use.
                  </p>
                </li>
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-neutral-500">
                CV services are kept completely separate from admission. Paying
                for a CV has no effect on whether an application is approved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Recruitment Professionals */}
      <section className="bg-ornate px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-light text-white">
            For Recruitment Professionals
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-[#9B7B3C]" />
          <p className="mt-6 text-base leading-relaxed text-neutral-400">
            Agencies that share our standards are invited to advertise
            vacancies and access the HHT Approved network as Founding Agency
            Partners.
          </p>
          <Link
            href="/agencies"
            className="btn-gold mt-8 inline-block rounded-md px-8 py-3 text-sm font-medium sm:px-10 sm:py-3.5 sm:text-base"
          >
            For Agencies
          </Link>
        </div>
      </section>
    </div>
  );
}
