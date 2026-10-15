import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Store",
  description: "पुस्तकें, ई-बुक और अध्ययन सामग्री। Books, e-books and study material.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
