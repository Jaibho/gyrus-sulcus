import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Courses",
  description: "Gyrus Sulcus के पाठ्यक्रम और बैच। Courses and batches by Gyrus Sulcus.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
