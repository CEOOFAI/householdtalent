'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Accordion row that opens smoothly (height + fade) using the CSS grid
// 0fr -> 1fr technique, so no height measuring is needed. Honours
// prefers-reduced-motion through the global motion rules.
export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className="border-b border-neutral-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading text-base font-medium text-white transition-colors duration-200 group-hover:text-[#C9A45C] sm:text-lg">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#9B7B3C] transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm leading-relaxed text-neutral-400">{children}</div>
        </div>
      </div>
    </div>
  )
}
