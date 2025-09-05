'use client'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { Input, Textarea } from '@/components/ui/Inputs'
import Button from '@/components/ui/Button'

function buildTree(items: any[]) {
  const map = new Map(items.map((i) => [i.id, { ...i, children: [] as any[] }]))
  const roots: any[] = []
  for (const item of map.values()) {
    if (item.parent_id && map.has(item.parent_id)) map.get(item.parent_id)!.children.push(item)
    else roots.push(item)
  }
  return roots
}

export default function CommentThread({ storyId }: { storyId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [pending, start] = useTransition()

  async function load() {
    const res = await fetch(`/api/comments?story_id=${storyId}`)
    if (!res.ok) return
    const data = await res.json()
    setComments(data.comments || [])
  }
  useEffect(() => {
    load()
  }, [])

  async function submit(parent_id?: string) {
    start(async () => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId, content, parent_id }),
      })
      if (res.ok) {
        setContent('')
        await load()
      }
    })
  }

  const tree = useMemo(() => buildTree(comments), [comments])

  return (
    <section className="mt-4 space-y-2">
      <h2 className="text-sm font-medium">Comments</h2>
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          placeholder="Write a comment…"
        />
        <Button onClick={() => submit()} disabled={pending || !content.trim()}>
          {pending ? 'Posting…' : 'Post'}
        </Button>
      </div>
      <div className="space-y-2">
        {tree.map((c) => (
          <CommentItem key={c.id} comment={c} onReply={(text: string) => setContent(`@reply:${c.id} ${text}`)} />
        ))}
      </div>
    </section>
  )
}

function CommentItem({ comment, onReply }: { comment: any; onReply: (t: string) => void }) {
  return (
    <div className="rounded-lg border border-outline p-2">
      <div className="text-sm">{comment.content}</div>
      <div className="mt-1 text-xs text-text/60">{new Date(comment.created_at).toLocaleString()}</div>
      <div className="mt-2 pl-3">
        {comment.children?.map((child: any) => (
          <CommentItem key={child.id} comment={child} onReply={onReply} />
        ))}
      </div>
    </div>
  )
}
