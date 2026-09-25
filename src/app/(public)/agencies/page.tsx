import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Minus,
  Megaphone,
  Users,
  Handshake,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "For Agencies",
  description:
    "Founding Agency Partner programme: advertise vacancies and access the HHT Approved network of household professionals. £295 per month for the first 6 months. No commission split.",
};

const BENEFITS = [
  {
    icon: Megaphone,
    title: "Advertise Your Vacancies",
    description:
      "List your household roles on HouseHoldTalent and reach HHT Approved professionals across Gibraltar, the Costa del Sol and internationally.",
  },
  {
    icon: Users,
    title: "Access the HHT Approved Network",
    description:
      "Browse the network and request introductions, including to passive professionals who are not actively looking and rarely appear elsewhere.",
  },
  {
    icon: Handshake,
    title: "Your Client Relationship Stays Yours",
    description:
      "No commission split and no interference in your client relationship. HHT facilitates the introduction; the placement remains yours.",
  },
];

const INCLUDED = [
  "Up to 4 active role listings at a time",
  "30-day listings, with additional roles from £125",
  "Full access to browse the HHT Approved network",
  "Request introductions to suitable candidates",
  "Agency profile as an HHT partner",
  "No commission split",
  "No interference in your client relationship",
];

const NOT_INCLUDED = [
  "Uploading or listing your own candidate database",
  "Priority Search (available to private employers only)",
];

export default function AgenciesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ornate py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B3C]">
            For Agencies
          </p>
          <h1 className="mt-4 font-heading text-4xl font-light text-white sm:text-5xl">
            A better place to find exceptional household staff
          </h1>
          <p className="mt-5 text-lg text-neutral-400">
            Recruitment agencies use HouseHoldTalent (HHT) to advertise
            vacancies and access the HHT Approved candidate network, including
            passive professionals.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <Reveal>
      <section className="bg-ornate px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {BENEFITS.map((item) => (
            <Card key={item.title} className="border-neutral-800 bg-black">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-4 inline-flex rounded-lg bg-[#9B7B3C]/10 p-2 text-[#9B7B3C]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-neutral-500">
          HHT Approved means every profile is individually reviewed by our team
          before admission. Agencies do not upload or list their own candidate
          database on HouseHoldTalent.
        </p>
      </section>
      </Reveal>

      {/* Founding Agency Partner */}
      <Reveal>
      <section className="bg-ornate px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center font-heading text-3xl font-light text-white">
            Founding Agency Partner
          </h2>

          <div className="relative rounded-2xl border-2 border-[#9B7B3C]/60 bg-black p-6 shadow-[0_0_40px_rgba(155,123,60,0.12)] sm:p-8">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#9B7B3C] px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              Founding Offer
            </span>

            <div className="text-center">
              <span className="font-heading text-5xl font-bold text-white">
                £295
              </span>
              <span className="ml-1 text-sm text-neutral-500">/ month</span>
              <p className="mt-2 text-sm text-neutral-400">
                For the first 6 months
              </p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                Founding partners receive preferential renewal terms. The
                established standard rate is currently £595 per month, subject
                to review.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7B3C]" />
                  <span className="text-sm text-neutral-300">{f}</span>
                </li>
              ))}
              {NOT_INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
                  <span className="text-sm text-neutral-500">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact?type=agency"
              className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-center text-sm font-semibold"
            >
              Apply as a Founding Partner <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-xs text-neutral-500">
              Founding partnership is offered to a limited number of agencies.
            </p>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Value */}
      <Reveal>
      <section className="bg-ornate px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <BadgeCheck className="mx-auto h-8 w-8 text-[#9B7B3C]" />
          <p className="mt-5 font-heading text-2xl font-light italic text-white sm:text-3xl">
            One successful placement could cover several months of
            HouseHoldTalent access.
          </p>
        </div>
      </section>
      </Reveal>

      {/* How it works for agencies */}
      <Reveal>
      <section className="bg-ornate px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-light text-white">
            How It Works
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-[#9B7B3C]" />
          <div className="mt-10 space-y-5">
            {[
              {
                step: "01",
                title: "List Your Roles",
                desc: "Advertise up to 4 active roles at a time, each live for 30 days.",
              },
              {
                step: "02",
                title: "Browse and Request Introductions",
                desc: "Browse anonymised HHT Approved profiles and request an introduction when a candidate suits your brief. Suitable candidates can also request an introduction to your roles.",
              },
              {
                step: "03",
                title: "HHT Facilitates the Introduction",
                desc: "HHT reviews each request and the candidate consents before contact details are released. Contact details are never shared automatically.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 border-l-2 border-[#9B7B3C]/40 pl-5"
              >
                <span className="font-heading text-3xl font-light text-[#9B7B3C]">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
      <section className="bg-ornate px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-[#9B7B3C]" />
          <h2 className="mt-4 font-heading text-3xl font-light text-white">
            Work With Us
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400">
            Agencies that share our standards are invited to apply. We will
            arrange a short conversation to discuss your roles and how the
            partnership works.
          </p>
          <Link
            href="/contact?type=agency"
            className="btn-gold mt-8 inline-block rounded-md px-8 py-3 text-sm font-medium sm:px-10 sm:py-3.5 sm:text-base"
          >
            Enquire About Agency Partnership
          </Link>
        </div>
      </section>
      </Reveal>
    </div>
  );
}
