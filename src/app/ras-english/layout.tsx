import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "RAS English",
  description: "RAS परीक्षा के लिए अंग्रेज़ी की तैयारी। English preparation for the RAS exam.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
