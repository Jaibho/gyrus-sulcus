import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: "Articles", template: '%s | Gyrus Sulcus' },
  description: "UPSC/RAS के लिए गहन द्विभाषी लेख और परीक्षा-उन्मुख अध्ययन सामग्री। In-depth bilingual articles and exam-oriented study material.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
