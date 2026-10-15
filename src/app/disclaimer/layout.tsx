import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Gyrus Sulcus का अस्वीकरण। Disclaimer of Gyrus Sulcus.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
