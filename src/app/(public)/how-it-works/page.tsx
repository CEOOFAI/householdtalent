import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How HouseHoldTalent connects exceptional household professionals with private households, family offices and estates across the UK, Europe and the Middle East.",
};

const EMPLOYER_STEPS = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description:
      "Submit a role brief outlining your ideal candidate. Select the role type, responsibilities, experience level and any specific preferences. It takes just a few minutes and we structure the rest into a professional brief.",
  },
  {
    step: "02",
    title: "We Find the Right Match",
    description:
      "Our team personally reviews your brief and curates a shortlist from our private network of vetted professionals. We consider experience, personality fit, location, availability and suitability for your specific household.",
  },
  {
    step: "03",
    title: "We Make the Introduction",
    description:
      "We introduce you to a small number of carefully selected candidates. No noise. No irrelevant profiles. Just the right people, presented professionally.",
  },
  {
    step: "04",
    title: "You Take It From There",
    description:
      "You review each introduction and decide who to meet. We step back and let you take it forward at your own pace, and we remain available throughout to support, advise or refine the search if needed.",
  },
];

const CANDIDATE_STEPS = [
  {
    step: "01",
    title: "Apply to Join the Network",
    description:
      "Submit your application and tell us about your experience, role specialism, languages and availability. If you have been referred or recommended, mention this in your application, it will be reviewed with priority. Access is by application, referral or recommendation only.",
  },
  {
    step: "02",
    title: "We Review Your Application",
    description:
      "Every application is personally reviewed by our team. We assess experience, presentation, references and suitability for private service. Not every application is accepted, and that is intentional. You will hear from us within 5 working days.",
  },
  {
    step: "03",
    title: "Build Your Profile",
    description:
      "Accepted members build a complete profile inside the member dashboard. References, supporting documents and a professionally curated profile are added at this stage. This is how the right households will find you.",
  },
  {
    step: "04",
    title: "Be Introduced",
    description:
      "When the right role comes along, we make the connection personally. You will receive a private introduction from our team with full details about the household and what they are looking for. No cold applications. Just warm, considered introductions.",
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
            introduction is personally considered.
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
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {EMPLOYER_STEPS.map((item) => (
              <StepCard key={item.step} item={item} />
            ))}
          </div>
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
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CANDIDATE_STEPS.map((item) => (
              <StepCard key={item.step} item={item} />
            ))}
          </div>
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
            Access by referral, recommendation or application. Every member personally reviewed.
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
