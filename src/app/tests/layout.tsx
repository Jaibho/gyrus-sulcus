import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Daily MCQ Tests",
  description: "रोज़ के MCQ टेस्ट — विज्ञान, राजव्यवस्था, अर्थव्यवस्था, भूगोल और समसामयिकी के द्विभाषी प्रश्न। Daily bilingual MCQ tests for UPSC, RAS and State PCS.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
