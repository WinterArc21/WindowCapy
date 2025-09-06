'use client'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { Input, Textarea } from '@/components/ui/Inputs'
import Button from '@/components/ui/Button'
import ReportButton from '@/components/story/ReportButton'
import { checkBlockedWords } from '@/lib/blocklist'

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
  const [error, setError] = useState<string | null>(null)

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
      setError(null)
      const blocked = checkBlockedWords(content)
      if (blocked.length) {
        setError(`Contains blocked terms: ${blocked.join(', ')}`)
        return
      }
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId, content, parent_id }),
      })
      if (res.ok) {
        setContent('')
        await load()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to post')
      }
    })
  }

  const tree = useMemo(() => buildTree(comments), [comments])

  return (
    <section className="mt-4 space-y-2">
      <h2 className="text-sm font-medium">Comments</h2>
      {error ? <div role="alert" className="rounded-md bg-bgError p-2 text-sm text-error">{error}</div> : null}
      <div className="flex gap-2">
        <Textarea
          aria-label="Comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          placeholder="Write a comment…"
        />
        <Button aria-label="Post comment" onClick={() => submit()} disabled={pending || !content.trim()}>
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
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm">{comment.content}</div>
        <ReportButton targetType="comment" targetId={comment.id} />
      </div>
      <div className="mt-1 text-xs text-text/60">{new Date(comment.created_at).toLocaleString()}</div>
      <div className="mt-2 pl-3">
        {comment.children?.map((child: any) => (
          <CommentItem key={child.id} comment={child} onReply={onReply} />
        ))}
      </div>
    </div>
  )
}
