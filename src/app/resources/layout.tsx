import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Resources",
  description: "UPSC/RAS की तैयारी के लिए उपयोगी संसाधन। Useful resources for UPSC/RAS preparation.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
