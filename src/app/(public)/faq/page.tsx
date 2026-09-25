import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about HouseHoldTalent, our platform, pricing, and how it all works.",
};

const FAQS = [
  {
    question: "How is Household Talent different from a staffing agency?",
    answer:
      "Traditional agencies charge a month's salary and act as intermediaries. We offer fixed-price access plans and give you direct access to carefully selected candidates. No placement fees, no commissions, no hidden costs.",
  },
  {
    question: "How are candidates selected?",
    answer:
      "Every candidate profile is reviewed by our team before being introduced. We assess experience, check references where possible, and ensure profiles meet a consistently high standard.",
  },
  {
    question: "Where do you operate?",
    answer:
      "Founded in Gibraltar, we serve clients internationally.",
  },
  {
    question: "Is it free for candidates?",
    answer:
      "Yes. Candidates can create a profile for free and be considered for introductions. Paid tiers offer enhanced visibility, priority placement, and a professionally structured CV.",
  },
  {
    question: "How do introductions work?",
    answer:
      "Employers submit a role brief describing what they need. Our team reviews it, selects the most suitable candidates, and makes personal introductions. No noise, no irrelevant profiles.",
  },
  {
    question: "Can I see candidates before posting a role?",
    answer:
      "We show a small selection of sample profiles on our candidates page. Full access to our network is provided once a role brief is submitted.",
  },
  {
    question: "What roles can I hire for?",
    answer:
      "Housekeepers, nannies, chefs, butlers, personal assistants, chauffeurs, gardeners, estate managers, security, elder care, yacht crew, pet care, personal trainers, and more.",
  },
  {
    question: "How do I submit a role brief?",
    answer:
      "Submit a role brief describing who you need. It takes less than 2 minutes. From there, our team handles the rest.",
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

        <div className="mt-16 space-y-4">
          {FAQS.map((faq) => (
            <Card key={faq.question} className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="font-heading text-base font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

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
