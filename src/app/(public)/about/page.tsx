import type { Metadata } from "next";
import Link from "next/link";
import { RevealGroup } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "HouseHoldTalent (HHT) is a private talent and introduction platform for HHT Approved household professionals and the families, estates and family offices who need them.",
};

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          About HouseHoldTalent
        </h1>

        <RevealGroup stagger={100} className="mt-12 space-y-10 text-neutral-400">
          <p className="text-lg leading-relaxed">
            HouseHoldTalent (HHT) is a private talent and introduction platform
            for exceptional household professionals and the families, estates
            and family offices who need them.
          </p>
          <p className="leading-relaxed">
            This is not a job board. It is not a recruitment agency. It is a
            curated introduction platform, built on the belief that the right
            introduction comes from trust, not traffic.
          </p>

          {/* Our Story */}
          <div className="rounded-xl border border-[#9B7B3C]/20 bg-[#9B7B3C]/5 p-5 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-white">
              Our Story
            </h2>
            <p className="mt-3 leading-relaxed">
              HouseHoldTalent was founded by Yolanda, who spent over 12 years
              working inside the private service world rather than observing it
              from the outside. She recognised that private staffing was ready
              for something new: a more considered, trust-led approach that
              works alongside the industry rather than around it. So she built
              it.
            </p>
          </div>

          {/* How We Are Different */}
          <h2 className="font-heading text-xl font-bold text-white">
            How We Are Different
          </h2>
          <p className="leading-relaxed">
            The private staffing industry has not kept pace with the
            expectations of the households it serves. Most platforms prioritise
            volume. Most candidate databases prioritise quantity over quality.
            HouseHoldTalent prioritises neither.
          </p>
          <p className="leading-relaxed">
            Every candidate in this network is HHT Approved. HHT Approved means
            every profile is individually reviewed by our team before
            admission, with attention to professionalism, experience,
            presentation and suitability for private service. Nobody simply
            signs up. Access is earned by application, referral or
            recommendation only.
          </p>
          <p className="leading-relaxed">
            For employers, that means every introduction we facilitate is a
            considered one. Contact details are never shared automatically. HHT
            stays in the middle, and details are released only with consent.
          </p>
          <p className="leading-relaxed">
            Recruitment professionals who share our standards are invited to
            join as agency partners. HouseHoldTalent is not in competition with
            good recruiters. It offers them access to a genuinely curated
            candidate network, presented professionally, with no compromise on
            quality.
          </p>

          {/* Mission */}
          <div className="rounded-xl border border-[#9B7B3C]/20 bg-[#9B7B3C]/5 p-5 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-white">
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed">
              To become the most trusted private household talent network in
              the world, where quality is protected, every introduction means
              something, and discretion is fundamental to everything we do.
            </p>
          </div>

          {/* Our Approach */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-white">
              Our Approach
            </h2>
            <p className="mt-3 leading-relaxed">
              We keep the network deliberately curated. A smaller,
              higher-quality pool of candidates consistently outperforms a
              large, unreviewed one. Our employers do not wade through hundreds
              of profiles. They see the right ones.
            </p>
            <p className="mt-3 leading-relaxed">
              Matching in the private household world is about more than
              experience and qualifications. It is about personality,
              discretion, compatibility and trust. We take all of it seriously.
            </p>
          </div>

          {/* Where We Operate */}
          <div className="text-center">
            <p className="text-sm uppercase tracking-wider text-[#9B7B3C]">
              Where We Operate
            </p>
            <p className="mt-3 font-heading text-lg text-white">
              Founded in Gibraltar. Working with private households, family
              offices and estates in Gibraltar, the Costa del Sol and
              internationally.
            </p>
          </div>

          {/* Why We Exist */}
          <h2 className="font-heading text-xl font-bold text-white">
            Why We Exist
          </h2>
          <p className="leading-relaxed">
            Because finding genuinely excellent household staff should not
            require luck, guesswork or compromise.
          </p>
          <p className="leading-relaxed">
            Because exceptional professionals in private service deserve a
            platform that presents them with the dignity their experience
            commands.
          </p>
          <p className="leading-relaxed">
            Because the families and households who rely on private staff
            deserve introductions they can trust.
          </p>

          <div className="text-center">
            <p className="font-heading text-2xl font-light italic text-white">
              HouseHoldTalent
            </p>
            <p className="mt-2 text-sm uppercase tracking-widest text-[#9B7B3C]">
              Selected, not listed.
            </p>
          </div>
        </RevealGroup>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register/employer"
              className="rounded-lg bg-[#9B7B3C] px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-[#7B6535]"
            >
              Submit a Role Brief
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-neutral-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Speak to Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
