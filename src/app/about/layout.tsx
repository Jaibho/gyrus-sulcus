import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About",
  description: "Gyrus Sulcus और इसके संस्थापक के बारे में। About Gyrus Sulcus and its founder.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
