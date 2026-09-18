/**
 * ArticleThumb — generates a designed thumbnail for every article.
 *
 * No stock photography and no external image files: the card is drawn with
 * CSS/SVG from the article's own data. That keeps every thumbnail copyright-
 * clean, means a new article never needs an image sourced by hand, and gives
 * the feed a consistent look. The pattern is seeded from the slug, so a given
 * article always renders the same way.
 */

type Variant = 'card' | 'hero'

type Pal = { from: string; to: string; ink: string }

/**
 * Three variants per category. Almost every current-affairs story shares one
 * category, so a single colour would make the grid look flat — the variant is
 * picked from the slug, giving a varied wall of cards that still reads as one
 * palette per subject.
 */
const PALETTES: Record<string, Pal[]> = {
  'समसामयिकी': [
    { from: '#0033CC', to: '#001640', ink: '#D6E0FF' },
    { from: '#1D4ED8', to: '#0C1E4A', ink: '#DBEAFE' },
    { from: '#3730A3', to: '#150C3D', ink: '#E0E7FF' },
  ],
  'विज्ञान': [
    { from: '#0E7490', to: '#052A38', ink: '#CFFAFE' },
    { from: '#0F766E', to: '#042F2A', ink: '#CCFBF1' },
    { from: '#0369A1', to: '#052A44', ink: '#E0F2FE' },
  ],
  'भूगोल': [
    { from: '#15803D', to: '#04250F', ink: '#DCFCE7' },
    { from: '#4D7C0F', to: '#1A2707', ink: '#ECFCCB' },
    { from: '#047857', to: '#032B20', ink: '#D1FAE5' },
  ],
  'राजव्यवस्था': [
    { from: '#6D28D9', to: '#250A52', ink: '#EDE9FE' },
    { from: '#A21CAF', to: '#3B0A40', ink: '#FAE8FF' },
    { from: '#BE185D', to: '#440620', ink: '#FCE7F3' },
  ],
  'अर्थव्यवस्था': [
    { from: '#B45309', to: '#3A1602', ink: '#FEF3C7' },
    { from: '#C2410C', to: '#411306', ink: '#FFEDD5' },
    { from: '#A16207', to: '#361F02', ink: '#FEF9C3' },
  ],
}
const FALLBACK: Pal[] = [
  { from: '#334155', to: '#0B1220', ink: '#E2E8F0' },
  { from: '#475569', to: '#111827', ink: '#F1F5F9' },
]

function seedOf(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export default function ArticleThumb({
  title,
  category,
  date,
  slug,
  variant = 'card',
  imageUrl,
  credit,
}: {
  title: string
  category?: string
  date?: string
  slug: string
  variant?: Variant
  /** Optional licensed photograph. When absent, the designed card is drawn. */
  imageUrl?: string
  /** Attribution line, required whenever imageUrl is set. */
  credit?: string
}) {
  const seed = seedOf(slug)
  const set = (category && PALETTES[category]) || FALLBACK
  const pal = set[seed % set.length]

  // Seeded decoration — stable per article, different between articles.
  const c1 = { cx: 18 + (seed % 30), cy: 20 + ((seed >> 3) % 25), r: 16 + ((seed >> 6) % 12) }
  const c2 = { cx: 60 + ((seed >> 9) % 32), cy: 55 + ((seed >> 12) % 35), r: 12 + ((seed >> 15) % 16) }
  const rot = -28 + (seed % 26)

  const isHero = variant === 'hero'

  return (
    <div
      className={`relative w-full overflow-hidden ${isHero ? 'rounded-2xl' : ''}`}
      style={{
        aspectRatio: '16 / 9',
        background: `linear-gradient(135deg, ${pal.from} 0%, ${pal.to} 100%)`,
      }}
    >
      {imageUrl ? (
        /* Licensed photograph. Plain <img> on purpose: next/image would need
           every source domain declared in next.config, and an undeclared one
           fails at runtime. This cannot break the page. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
      /* Seeded background geometry */
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <circle cx={c1.cx} cy={c1.cy} r={c1.r} fill="#FFFFFF" opacity="0.07" />
        <circle cx={c2.cx} cy={c2.cy} r={c2.r} fill="#FFFFFF" opacity="0.05" />
        <rect
          x="55" y="-30" width="14" height="170"
          fill="#FFFFFF" opacity="0.05"
          transform={`rotate(${rot} 62 50)`}
        />
        <rect
          x="74" y="-30" width="5" height="170"
          fill="#FFFFFF" opacity="0.07"
          transform={`rotate(${rot} 76 50)`}
        />
      </svg>
      )}

      {/* Legibility wash behind the text */}
      <div
        className="absolute inset-0"
        style={{
          background: imageUrl
            ? 'linear-gradient(to top, rgba(0,0,0,0.80), rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.30))'
            : 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 62%)',
        }}
        aria-hidden="true"
      />

      <div className={`relative h-full flex flex-col justify-between ${isHero ? 'p-6 md:p-8' : 'p-4'}`}>
        <div>
          {category && (
            <span
              className={`inline-block rounded-full font-semibold backdrop-blur-sm ${
                isHero ? 'text-sm px-3.5 py-1.5' : 'text-[11px] px-2.5 py-1'
              }`}
              style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF' }}
            >
              {category}
            </span>
          )}
        </div>

        <div>
          <h3
            className={`font-bold text-white leading-snug ${
              isHero ? 'text-2xl md:text-3xl line-clamp-4' : 'text-[15px] line-clamp-3'
            }`}
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}
          >
            {title}
          </h3>

          <div className={`flex items-center justify-between ${isHero ? 'mt-4' : 'mt-2.5'}`}>
            <span
              className={isHero ? 'text-sm' : 'text-[11px]'}
              style={{ color: pal.ink, opacity: 0.95 }}
            >
              {date ? new Date(date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </span>
            <span
              className={`font-bold tracking-widest ${isHero ? 'text-xs' : 'text-[9px]'}`}
              style={{ color: '#FFFFFF', opacity: 0.75 }}
            >
              GYRUS SULCUS
            </span>
          </div>

          {credit && (
            <div
              className={`${isHero ? 'text-[11px] mt-2' : 'text-[9px] mt-1.5'}`}
              style={{ color: '#FFFFFF', opacity: 0.6 }}
            >
              {credit}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
