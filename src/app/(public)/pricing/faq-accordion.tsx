"use client";

import { AccordionItem } from "@/components/motion/accordion-item";

const FAQS = [
  {
    q: "Do I pay if I hire someone?",
    a: "No. All fees are paid upfront for 30 days of access. There are no success fees or commissions.",
  },
  {
    q: "Can I replace a role once it is filled?",
    a: "On Ongoing Hiring and Priority Search, you receive 1 replacement role if a position is filled within your 30-day access period. Standard includes one live role with no replacement.",
  },
  {
    q: "What is the difference between Ongoing Hiring and Priority Search?",
    a: "With Ongoing Hiring, you browse the HHT Approved network and request introductions yourself. With Priority Search, HHT actively searches on your behalf, reaches out to suitable candidates and delivers a curated shortlist.",
  },
  {
    q: "What does HHT Approved mean?",
    a: "HHT Approved means every profile is individually reviewed by our team before admission. Where HHT has obtained referee feedback, the profile is also marked References Checked.",
  },
  {
    q: "What if I don't find the right candidate?",
    a: "HouseHoldTalent provides access to HHT Approved candidates and facilitated introductions, not guaranteed outcomes.",
  },
  {
    q: "Can agencies use the platform?",
    a: "Yes. Agencies join through our Founding Agency Partner programme rather than an employer plan. Please see For Agencies for details.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return <AccordionItem question={q}>{a}</AccordionItem>;
}

export default function FAQAccordion() {
  return (
    <div>
      {FAQS.map((faq) => (
        <FAQItem key={faq.q} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
}
