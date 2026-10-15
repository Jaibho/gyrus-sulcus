import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Login",
  description: "Gyrus Sulcus में लॉगिन करें। Log in to Gyrus Sulcus.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
