'use client'
import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT } from '@/lib/ads'

// A single responsive AdSense display unit. Renders nothing unless BOTH the
// publisher id (env) and a slot id are configured — so it stays invisible and
// policy-safe until the account is approved and slot ids are added.
declare global {
  interface Window { adsbygoogle?: unknown[] }
}

export default function AdSlot({ slot, className = '' }: { slot?: string; className?: string }) {
  const ref = useRef<HTMLModElement>(null)
  const active = !!ADSENSE_CLIENT && !!slot

  useEffect(() => {
    if (!active) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* ignore */
    }
  }, [active])

  if (!active) return null

  return (
    <div className={`my-6 text-center ${className}`}>
      <span className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">विज्ञापन • Advertisement</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
