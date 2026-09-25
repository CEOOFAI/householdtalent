import type { Metadata } from "next";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import FAQAccordion from "./faq-accordion";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Access exceptional household staff. Direct introductions, no placement fees, complete discretion. Plans from £165.",
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
      "Access to curated candidate network",
      "Employer and candidate introduction requests",
      "HHT-facilitated introductions",
    ],
    cta: "Submit a Role Brief",
    popular: false,
    mobileOrder: 2,
  },
  {
    name: "Ongoing Hiring",
    price: "£295",
    subtitle: "30 days access",
    features: [
      "Up to 2 live roles at any time",
      "1 replacement role if a position is filled within 30 days",
      "Access to curated candidate network",
      "Employer and candidate introduction requests",
      "HHT-facilitated introductions",
    ],
    cta: "Submit Role Briefs",
    popular: true,
    mobileOrder: 1,
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
      "Role-specific candidate suitability questionnaire",
      "Professional referee feedback obtained and summarised",
      "Curated shortlist delivered",
    ],
    cta: "Request Talent Search",
    popular: false,
    mobileOrder: 3,
  },
];

/* ------------------------------------------------------------------ */
/*  Plan Card                                                          */
/* ------------------------------------------------------------------ */

function PlanCard({ plan }: { plan: (typeof EMPLOYER_PLANS)[number] }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-black p-5 sm:p-7 ${
        plan.popular
          ? "border-2 border-[#9B7B3C]/60 shadow-[0_0_30px_rgba(155,123,60,0.08)] md:shadow-[0_0_40px_rgba(155,123,60,0.12)]"
          : "border-neutral-800"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#9B7B3C] px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
          Most Popular
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
      </ul>

      <div className="mt-auto pt-6">
        <p className="text-[11px] text-neutral-500">
          {plan.name === "Standard"
            ? "One active role for the full 30-day period. Upgrade to add replacement roles."
            : "Replacement roles available within your 30-day access period."}
        </p>

        <Link
          href={plan.cta === "Request Access" ? "/contact" : "/register/employer"}
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
            Hire directly. No placement fees. No commission. Just curated introductions.
          </p>
        </div>
      </section>

      {/* Employer Plans */}
      <section className="bg-ornate px-4 pb-12 sm:px-6">
        <p className="mx-auto mb-10 max-w-5xl text-center text-sm text-neutral-500">
          Designed for private households and discreet hiring environments
        </p>

        {/* Desktop: 3 columns in spec order */}
        <div className="mx-auto hidden max-w-5xl items-stretch gap-5 md:grid md:grid-cols-3">
          {EMPLOYER_PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Mobile: reordered (Priority first) */}
        <div className="mx-auto flex max-w-md flex-col gap-5 md:hidden">
          {[...EMPLOYER_PLANS]
            .sort((a, b) => a.mobileOrder - b.mobileOrder)
            .map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-neutral-500">
          All plans are prepaid, non-refundable, and time-limited. Unused time
          does not roll over.
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
            Apply to join the network. All applications are reviewed before
            acceptance.
          </p>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Standard Profile - Complimentary */}
            <div className="rounded-2xl border border-neutral-800 bg-black p-5 sm:p-8">
              <h3 className="font-heading text-xl font-semibold text-white">
                Standard Profile
              </h3>
              <div className="mt-4">
                <span className="font-heading text-4xl font-bold text-white">
                  Complimentary
                </span>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  For accepted members. All applications are reviewed before
                  acceptance into the network.
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Submit your application and supporting CV",
                  "Personally reviewed by the HHT team",
                  "Profile (photo, job title, location, languages)",
                  "Considered for current and upcoming introductions",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                    <span className="text-sm text-neutral-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register/candidate"
                className="mt-8 block w-full rounded-lg border border-[#9B7B3C] py-3 text-center text-sm font-semibold text-[#9B7B3C] transition-colors hover:bg-[#9B7B3C]/10"
              >
                Apply to Join
              </Link>
            </div>

            {/* Premium Profile */}
            <div className="rounded-2xl border-2 border-[#9B7B3C]/60 bg-black p-5 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#9B7B3C] text-[#9B7B3C]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9B7B3C]">
                  Premium
                </span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white">
                Premium Profile
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-white">
                  £50
                </span>
                <span className="text-sm text-neutral-500">for 3 months</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Enhanced profile (more detailed information)",
                  "Gold-highlighted profile",
                  "Increased visibility to employers",
                  "Professionally structured CV",
                  "Downloadable CV",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                    <span className="text-sm text-neutral-300">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-neutral-500">
                A professionally structured profile ensures you are presented at
                the highest standard.
              </p>
              <Link
                href="/register/candidate"
                className="btn-gold mt-6 block w-full rounded-lg py-3 text-center text-sm"
              >
                Upgrade My Profile
              </Link>
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
            We work with a select group of trusted recruiters who share our
            standards. To discuss listing roles and accessing our candidate
            network, get in touch.
          </p>
          <Link
            href="/contact"
            className="btn-gold mt-8 inline-block rounded-md px-8 py-3 text-sm font-medium sm:px-10 sm:py-3.5 sm:text-base"
          >
            Apply to Work With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
