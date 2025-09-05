'use client'
import { useEffect, useState, useTransition } from 'react'
import Tooltip from '@/components/ui/Tooltip'

const TYPES = [
  { key: 'tell_me_more', label: 'Tell me more' },
  { key: 'interesting', label: 'Interesting' },
  { key: 'relatable', label: 'Relatable' },
  { key: 'new_perspective', label: 'New perspective' },
  { key: 'wow', label: 'Wow' },
] as const

type Counts = { type: string; count: number }[]

export default function ReactionBar({ storyId }: { storyId: string }) {
  const [counts, setCounts] = useState<Counts>([])
  const [mine, setMine] = useState<string[]>([])
  const [pending, start] = useTransition()

  async function load() {
    const res = await fetch(`/api/reactions?story_id=${storyId}`)
    if (!res.ok) return
    const data = (await res.json()) as { counts: Counts; mine: string[] }
    setCounts(data.counts)
    setMine(data.mine)
  }

  useEffect(() => {
    load()
  }, [])

  function toggle(type: string) {
    start(async () => {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId, type }),
      })
      if (res.ok) load()
    })
  }

  function countFor(t: string) {
    return counts.find((c) => c.type === t)?.count || 0
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {TYPES.map((t) => (
        <Tooltip key={t.key} text={t.label}>
          <button
            onClick={() => toggle(t.key)}
            className={
              'rounded-full border border-outline px-2 py-1 text-xs ' +
              (mine.includes(t.key) ? 'bg-tertiary' : 'bg-secondary')
            }
            aria-pressed={mine.includes(t.key)}
            disabled={pending}
          >
            {t.label} • {countFor(t.key)}
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
