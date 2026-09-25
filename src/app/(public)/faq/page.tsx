import type { Metadata } from "next";
import { AccordionItem } from "@/components/motion/accordion-item";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about HouseHoldTalent: HHT Approved profiles, HHT-facilitated introductions, pricing and candidate membership.",
};

const FAQS = [
  {
    question: "How is HouseHoldTalent different from a recruitment agency?",
    answer:
      "HouseHoldTalent (HHT) is a private talent and introduction platform, not a recruitment agency. Traditional agencies typically charge a percentage of salary. We offer fixed-price 30-day access plans, with no success fees and no commission. Every introduction is facilitated by HHT.",
  },
  {
    question: "What does HHT Approved mean?",
    answer:
      "HHT Approved means every profile is individually reviewed by our team before admission. We consider experience across private households, family offices, estates, yachts and recognised luxury hospitality. Where HHT has obtained referee feedback, the profile is also marked References Checked.",
  },
  {
    question: "Where do you operate?",
    answer:
      "Founded in Gibraltar, we work with households in Gibraltar, the Costa del Sol and internationally.",
  },
  {
    question: "Is it free for candidates?",
    answer:
      "Yes. Membership is complimentary at launch. Approved members may choose optional CV services (HHT CV Polish, £35, or Professional CV, £59). These are kept completely separate from admission, and paying for a CV has no effect on whether an application is approved.",
  },
  {
    question: "How do introductions work?",
    answer:
      "Employers post a role and browse anonymised HHT Approved profiles. Candidates browse suitable roles. Either side can request an introduction. HHT reviews each request, the candidate consents, and HHT facilitates the introduction. Contact details are never shared automatically.",
  },
  {
    question: "Will HHT search for candidates on my behalf?",
    answer:
      "Yes, with Priority Search. HHT runs a dedicated talent search, reaches out to suitable candidates and delivers a curated shortlist. On Standard and Ongoing Hiring, you browse the network and request introductions yourself.",
  },
  {
    question: "Can I see candidates before posting a role?",
    answer:
      "We share a small selection of HHT Approved profiles, with consent, on our candidates page. Full access to the network is provided to registered employers with an active plan.",
  },
  {
    question: "What roles can I hire for?",
    answer:
      "Housekeepers, nannies, chefs, butlers, personal assistants, chauffeurs, gardeners, estate managers, security, elder care, yacht crew, pet care, personal trainers, and more.",
  },
  {
    question: "How do I submit a role brief?",
    answer:
      "Submit a role brief describing who you need. It takes just a few minutes, and our team reviews every brief before it goes live.",
  },
];

export default function FAQPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about HouseHoldTalent.
          </p>
        </div>

        <Reveal className="mt-12 border-t border-neutral-800">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.question} question={faq.question} defaultOpen={i === 0}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Reveal>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="/contact"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
