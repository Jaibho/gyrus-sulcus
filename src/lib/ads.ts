// AdSense ad-unit slot IDs. Fill these in AFTER Google approves the site:
// AdSense dashboard → Ads → By ad unit → create a "Display ad" for each spot →
// copy its data-ad-slot number → set it as the matching env var in Vercel.
// Until a slot is set, the <AdSlot> renders nothing (safe before approval).
export const AD_SLOTS = {
  testsLanding: process.env.NEXT_PUBLIC_AD_SLOT_TESTS || '',   // tests landing page
  results: process.env.NEXT_PUBLIC_AD_SLOT_RESULTS || '',      // quiz results/review page (best earner)
  articleFooter: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE || '',// bottom of an article
}

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''
