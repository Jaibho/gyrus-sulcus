'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { ShoppingBag, ArrowLeft } from 'lucide-react'

// NOTE: The store is not launched yet. The original product grid is preserved in
// git history — restore it (and re-enable STORE_LAUNCHED in page.tsx + the /store
// links in Navbar.tsx & Footer.tsx) once stock is ready.
export default function StorePage() {
  const { t } = useLanguage()
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-5">
        <ShoppingBag size={30} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {t('स्टोर जल्द आ रहा है', 'Store Coming Soon')}
      </h1>
      <p className="text-gray-500 mb-8">
        {t(
          'हमारा स्टोर अभी तैयार किया जा रहा है। जल्द ही अध्ययन सामग्री और मर्चेंडाइज़ यहाँ उपलब्ध होंगे।',
          'Our store is being set up. Study material and merchandise will be available here soon.'
        )}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
      >
        <ArrowLeft size={18} /> {t('होम पर वापस जाएं', 'Back to Home')}
      </Link>
    </div>
  )
}
