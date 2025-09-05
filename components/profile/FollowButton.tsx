'use client'
import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'

export default function FollowButton({ targetId, isFollowing: initial }: { targetId: string; isFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initial)
  const [pending, start] = useTransition()

  function toggle() {
    start(async () => {
      try {
        const method = isFollowing ? 'DELETE' : 'POST'
        const res = await fetch('/api/follows', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followee_id: targetId }),
        })
        if (!res.ok) throw new Error('Failed')
        setIsFollowing(!isFollowing)
      } catch {}
    })
  }

  return (
    <Button onClick={toggle} disabled={pending} variant={isFollowing ? 'secondary' : 'primary'}>
      {pending ? 'Working…' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}
