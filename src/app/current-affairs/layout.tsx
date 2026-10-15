import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: "Current Affairs", template: '%s | Gyrus Sulcus' },
  description: "तिथिवार समसामयिकी — पूरे संदर्भ के साथ। Dated current affairs with full context for UPSC, RAS and State PCS.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
