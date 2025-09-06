'use client'
import Button from '@/components/ui/Button'
import { useTransition } from 'react'

export default function SaveButton({ storyId, name = 'Favorites' }: { storyId: string; name?: string }) {
  const [pending, start] = useTransition()
  function save() {
    start(async () => {
      await fetch('/api/collections/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, story_id: storyId }),
      })
    })
  }
  return (
    <Button aria-label='Save story to Favorites' onClick={save} disabled={pending} variant="secondary">
      {pending ? 'Saving…' : 'Save'}
    </Button>
  )
}
