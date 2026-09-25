import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "HouseHoldTalent is a private network for exceptional household professionals and the families, estates and family offices who need them. Access by referral, recommendation or application only.",
};

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
          About HouseHoldTalent
        </h1>

        <div className="mt-12 space-y-10 text-neutral-400">
          <p className="text-lg leading-relaxed">
            HouseHoldTalent is a private network for exceptional household
            professionals and the families, estates and family offices who need
            them.
          </p>
          <p className="leading-relaxed">
            This is not a job board. It is not a recruiter database. It is a
            curated introduction ecosystem, built on the belief that the right
            placement comes from trust, not traffic.
          </p>

          {/* Our Story */}
          <div className="rounded-xl border border-[#9B7B3C]/20 bg-[#9B7B3C]/5 p-5 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-white">
              Our Story
            </h2>
            <p className="mt-3 leading-relaxed">
              HouseHoldTalent was founded by Yolanda, someone who spent over 12
              years working inside the private service world, not observing it
              from the outside. She recognised that the private staffing world
              was ready for something new, a more direct, trust-led approach
              that worked alongside the industry rather than around it. So she
              built it.
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
            Every candidate who joins this network has been reviewed. Every
            profile has been assessed for professionalism, experience,
            presentation and suitability for private service. Nobody simply
            signs up. Access is earned, by application, referral or
            recommendation only.
          </p>
          <p className="leading-relaxed">
            For employers, that means every introduction we make is a
            considered one. No noise. No irrelevant profiles. No wasted time.
          </p>
          <p className="leading-relaxed">
            We also work with a select group of trusted recruitment
            professionals who share our standards. HouseHoldTalent is not in
            competition with good recruiters, it is a better place for them to
            work. Access to a genuinely curated candidate pool, presented
            professionally, with no noise and no compromise on quality.
          </p>

          {/* Mission */}
          <div className="rounded-xl border border-[#9B7B3C]/20 bg-[#9B7B3C]/5 p-5 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-white">
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed">
              To become the most trusted private staffing network in the world,
              where quality is protected, discretion is guaranteed, and every
              introduction means something.
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
              large, unvetted one. Our employers do not receive fifty profiles.
              They receive the right ones.
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
              Founded in Gibraltar. Operating globally across private
              households, family offices and estates.
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
        </div>

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
