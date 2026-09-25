import type { Metadata } from "next";
import Link from "next/link";
import { RevealGroup } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How HouseHoldTalent facilitates private introductions between HHT Approved household professionals and private households, family offices and estates in Gibraltar, the Costa del Sol and internationally.",
};

const EMPLOYER_STEPS = [
  {
    step: "01",
    title: "Post a Role or Browse the Network",
    description:
      "Submit a role brief outlining the role type, responsibilities, experience level and any specific preferences. It takes just a few minutes. You can also browse anonymised profiles from the HHT Approved network.",
  },
  {
    step: "02",
    title: "Request an Introduction",
    description:
      "When a profile interests you, request an introduction. Suitable candidates can also request an introduction to your role. Contact details are never shared automatically.",
  },
  {
    step: "03",
    title: "We Review, the Candidate Consents",
    description:
      "Our team reviews each request and the candidate confirms they wish to be introduced. Identifying details are released only with consent.",
  },
  {
    step: "04",
    title: "HHT Facilitates the Introduction",
    description:
      "We make the introduction personally and discreetly. HHT stays in the middle throughout, and we remain available to support and advise as you take things forward.",
  },
];

const CANDIDATE_STEPS = [
  {
    step: "01",
    title: "Apply to Join the Network",
    description:
      "Submit your application and tell us about your experience, role specialism, languages and availability. If you have been referred or recommended, please mention this, as your application will be reviewed with priority. Access is by application, referral or recommendation only.",
  },
  {
    step: "02",
    title: "We Review Your Application",
    description:
      "Every application is individually reviewed by our team. We consider experience across private households, family offices, estates, yachts and recognised luxury hospitality, together with presentation and suitability for private service. Not every application is accepted, and that is intentional. You will hear from us within 5 working days.",
  },
  {
    step: "03",
    title: "Build Your Profile",
    description:
      "Approved members build a complete HHT Approved profile inside the member dashboard, adding references and supporting documents. Membership is complimentary.",
  },
  {
    step: "04",
    title: "Browse Roles and Be Introduced",
    description:
      "Browse suitable roles and request introductions, or be requested by employers. HHT facilitates every connection, and your details are shared only with your consent. No cold applications. Just considered introductions.",
  },
];

type Step = (typeof EMPLOYER_STEPS)[number];

function StepCard({ item }: { item: Step }) {
  return (
    <div className="flex h-full flex-col border-l-2 border-[#9B7B3C] bg-card p-7 sm:p-8">
      <span className="font-heading text-4xl font-light text-[#9B7B3C] sm:text-5xl">
        {item.step}
      </span>
      <h3 className="mt-5 font-heading text-lg font-medium text-white sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
            How It Works
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you are hiring or applying to join the network, every
            introduction is facilitated by HouseHoldTalent (HHT).
          </p>
        </div>

        {/* For Employers */}
        <div className="mt-24">
          <h2 className="text-center font-heading text-2xl font-light text-primary sm:text-3xl">
            For Employers
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Find exceptional staff for your household
          </p>
          <RevealGroup stagger={90} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {EMPLOYER_STEPS.map((item) => (
              <StepCard key={item.step} item={item} />
            ))}
          </RevealGroup>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
            Prefer us to search for you? With{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              Priority Search
            </Link>
            , HHT actively searches on your behalf and delivers a curated
            shortlist.
          </p>
          <div className="mt-10 text-center">
            <Link
              href="/register/employer"
              className="btn-gold inline-block rounded-md px-8 py-3 text-sm font-medium sm:px-10 sm:py-3.5 sm:text-base"
            >
              Submit a Role Brief
            </Link>
          </div>
        </div>

        {/* For Candidates */}
        <div className="mt-24">
          <h2 className="text-center font-heading text-2xl font-light text-primary sm:text-3xl">
            For Candidates
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Be introduced to the right households
          </p>
          <RevealGroup stagger={90} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CANDIDATE_STEPS.map((item) => (
              <StepCard key={item.step} item={item} />
            ))}
          </RevealGroup>
          <div className="mt-10 text-center">
            <Link
              href="/register/candidate"
              className="btn-gold inline-block rounded-md px-8 py-3 text-sm font-medium sm:px-10 sm:py-3.5 sm:text-base"
            >
              Apply to Join the Network
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h2 className="font-heading text-2xl font-light text-white sm:text-3xl">
            A Private Network. By Introduction Only.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Access by referral, recommendation or application. Every member individually reviewed.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register/employer"
              className="rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Submit a Role Brief
            </Link>
            <Link
              href="/register/candidate"
              className="rounded-md border border-border bg-secondary px-8 py-3 text-base font-medium text-white transition-colors hover:bg-muted"
            >
              Apply to Join the Network
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
