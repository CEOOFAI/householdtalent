"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I pay if I hire someone?",
    a: "No. All fees are paid upfront for access. There are no placement fees or commissions.",
  },
  {
    q: "Can I reuse my roles?",
    a: "Yes. You can replace roles as they are filled within your access period, up to your plan limit.",
  },
  {
    q: "What if I don't find the right candidate?",
    a: "The platform provides access to quality candidates, not guaranteed outcomes.",
  },
  {
    q: "Can agencies use the platform?",
    a: "Yes, provided they comply with our terms and do not approach clients or misrepresent themselves.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-heading text-base font-medium text-white pr-4">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#9B7B3C] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-neutral-400">{a}</p>
      )}
    </div>
  );
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
