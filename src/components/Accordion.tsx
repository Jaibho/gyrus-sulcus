'use client'
import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  title: ReactNode
  body: ReactNode
}

export function Accordion({ items, allowMultiple = false }: { items: AccordionItem[]; allowMultiple?: boolean }) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setOpen(prev => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        if (!allowMultiple) next.clear()
        next.add(i)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{item.title}</span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {item.body}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Inline glossary pill. Use inside article prose to mark technical terms.
 * Click reveals a short definition without leaving the page.
 *
 * <GlossaryTerm label="Superconductor" definition="A material that conducts..." />
 */
export function GlossaryTerm({ label, definition }: { label: string; definition: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="underline decoration-dotted decoration-indigo-400 underline-offset-2 text-indigo-700 hover:text-indigo-800"
      >
        {label}
      </button>
      {open && (
        <span className="absolute left-0 top-full mt-1 z-50 w-64 rounded-lg bg-gray-900 text-white text-xs leading-relaxed shadow-xl p-3">
          {definition}
          <button
            onClick={() => setOpen(false)}
            className="block mt-2 text-indigo-300 hover:text-white text-[10px] uppercase tracking-wide"
          >
            Close
          </button>
        </span>
      )}
    </span>
  )
}
