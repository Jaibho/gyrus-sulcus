import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Notes",
  description: "हस्तलिखित नोट्स और PDF अध्ययन सामग्री। Handwritten notes and PDF study material.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
