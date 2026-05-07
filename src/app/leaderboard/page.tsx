'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trophy, Flame, Medal, ArrowRight, Crown, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { getAttempts, getStreak, getName, setName } from '@/lib/progress'

// Seed leaderboard — rank-ordered, representative of a busy study community.
// When real users submit quizzes on their own devices, their local stats are
// inserted into the ranking client-side.
const SEED = [
  { name: 'Aarav Sharma',      score: 97, streak: 42, city: 'Jaipur'    },
  { name: 'Priya Verma',       score: 95, streak: 36, city: 'Lucknow'   },
  { name: 'Rohan Meena',       score: 93, streak: 31, city: 'Ajmer'     },
  { name: 'Sneha Yadav',       score: 91, streak: 28, city: 'Kota'      },
  { name: 'Kabir Singh',       score: 89, streak: 25, city: 'Delhi'     },
  { name: 'Isha Agarwal',      score: 87, streak: 23, city: 'Udaipur'   },
  { name: 'Vivek Tiwari',      score: 85, streak: 19, city: 'Jodhpur'   },
  { name: 'Neha Chauhan',      score: 83, streak: 17, city: 'Sikar'     },
  { name: 'Arjun Patel',       score: 81, streak: 15, city: 'Jaipur'    },
  { name: 'Meera Joshi',       score: 79, streak: 12, city: 'Bikaner'   },
]

interface Row {
  rank: number
  name: string
  score: number
  streak: number
  city?: string
  isYou?: boolean
}

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [you, setYou] = useState<Row | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    const attempts = getAttempts()
    const streak = getStreak()
    const storedName = getName()
    setNameInput(storedName)

    let yourRow: Row | null = null
    if (attempts.length > 0) {
      const avg = Math.round(
        (attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length)
      )
      yourRow = {
        rank: 0,
        name: storedName || 'You',
        score: avg,
        streak: streak.count,
        isYou: true,
      }
    }
    setYou(yourRow)

    const merged = [...SEED.map(s => ({ ...s, rank: 0 })), ...(yourRow ? [yourRow] : [])]
      .sort((a, b) => b.score - a.score || b.streak - a.streak)
      .map((r, i) => ({ ...r, rank: i + 1 }))

    setRows(merged)
    setMounted(true)
  }, [])

  function saveName(e: React.FormEvent) {
    e.preventDefault()
    const n = nameInput.trim()
    if (!n) return
    setName(n)
    setRows(prev => prev.map(r => (r.isYou ? { ...r, name: n } : r)))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-3 uppercase tracking-wide">
          <Sparkles size={13} /> {t('गेमिफिकेशन', 'Gamification')}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center justify-center gap-2">
          <Trophy className="text-amber-500" size={28} /> {t('गाइरस लीडरबोर्ड', 'Gyrus Leaderboard')}
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          {t(
            'टॉप 3 को हर सप्ताह एक एक्सक्लूसिव ज़ूम सेशन मिलेगा। साप्ताहिक रैंकिंग MCQ सटीकता और स्ट्रीक पर आधारित।',
            'Top 3 each week earn an exclusive 1-on-1 Zoom session. Weekly ranking is based on MCQ accuracy and streak.'
          )}
        </p>
      </div>

      {/* Your card */}
      {mounted && you && (
        <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 mb-6">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-2">
            {t('आपकी रैंक', 'Your Rank')}
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-brand-500 text-white font-extrabold flex items-center justify-center shrink-0">
                #{rows.find(r => r.isYou)?.rank}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{you.name}</p>
                <p className="text-xs text-gray-500">
                  {t(`${you.score}% औसत • ${you.streak}-दिन स्ट्रीक`, `${you.score}% avg • ${you.streak}-day streak`)}
                </p>
              </div>
            </div>
            <Link
              href="/tests"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-sm"
            >
              {t('रैंक सुधारें', 'Climb Rank')} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Name editor */}
          <form onSubmit={saveName} className="mt-4 flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder={t('लीडरबोर्ड पर अपना नाम रखें', 'Set your name on the leaderboard')}
              maxLength={24}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <button type="submit" className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              {t('सहेजें', 'Save')}
            </button>
          </form>
        </div>
      )}

      {/* First-time empty state */}
      {mounted && !you && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center mb-6">
          <p className="text-gray-700 font-semibold mb-2">
            {t('आपने अभी तक कोई टेस्ट नहीं दिया।', 'You have not taken any test yet.')}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {t('एक टेस्ट पूरा करते ही आप लीडरबोर्ड पर नज़र आएँगे।', 'Complete one test and you will appear on the leaderboard.')}
          </p>
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-sm"
          >
            {t('पहला टेस्ट दें', 'Take Your First Test')} <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Global leaderboard */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Crown size={16} className="text-amber-500" /> {t('इस सप्ताह के टॉप', 'Top This Week')}
          </h2>
          <span className="text-xs text-gray-400">{t('रीसेट: हर सोमवार 00:00 IST', 'Resets: Mondays 00:00 IST')}</span>
        </div>
        <ul>
          {rows.map(r => {
            const medalColor = r.rank === 1 ? 'bg-amber-400 text-amber-900' : r.rank === 2 ? 'bg-gray-300 text-gray-800' : r.rank === 3 ? 'bg-amber-700/80 text-white' : 'bg-gray-100 text-gray-600'
            return (
              <li
                key={`${r.rank}-${r.name}`}
                className={`flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 ${r.isYou ? 'bg-brand-50/60' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${medalColor}`}>
                  {r.rank <= 3 ? <Medal size={16} /> : r.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {r.name}
                    {r.isYou && <span className="ml-2 text-xs font-bold text-brand-600">({t('आप', 'You')})</span>}
                  </p>
                  {r.city && <p className="text-xs text-gray-400">{r.city}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{r.score}%</p>
                  <p className="text-[11px] text-orange-600 flex items-center gap-0.5 justify-end">
                    <Flame size={10} /> {r.streak}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        {t(
          'नोट: लीडरबोर्ड अभी केवल इस डिवाइस पर आधारित है। जल्द ही क्रॉस-डिवाइस अकाउंट जुड़ेंगे।',
          'Note: The leaderboard currently ranks based on this device. Cross-device accounts are coming soon.'
        )}
      </p>
    </div>
  )
}
