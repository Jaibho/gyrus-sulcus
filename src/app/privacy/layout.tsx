import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Gyrus Sulcus की गोपनीयता नीति। Privacy policy of Gyrus Sulcus.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
