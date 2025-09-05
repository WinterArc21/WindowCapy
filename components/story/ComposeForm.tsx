'use client'
import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import { Textarea, Input } from '@/components/ui/Inputs'
import { uploadImage, uploadAudio } from '@/lib/storage'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { checkBlockedWords } from '@/lib/blocklist'

export default function ComposeForm() {
  const [content, setContent] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'followers'>('public')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [sensitive, setSensitive] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recording, setRecording] = useState(false)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    const chunks: BlobPart[] = []
    mr.ondataavailable = (e) => chunks.push(e.data)
    mr.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }))
    mr.start()
    mediaRef.current = mr
    setRecording(true)
  }
  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const blocked = checkBlockedWords(content)
    if (blocked.length) {
      setError(`Contains blocked terms: ${blocked.join(', ')}`)
      return
    }
    setSubmitting(true)
    try {
      const supabase = supabaseBrowser()
      if (!supabase) throw new Error('Supabase not configured')
      let image_url: string | null = null
      let audio_url: string | null = null
      if (imageFile) image_url = await uploadImage(imageFile)
      if (audioBlob) {
        const file = new File([audioBlob], 'diary.webm', { type: 'audio/webm' })
        audio_url = await uploadAudio(file)
      }
      const { error: insertError } = await supabase.from('stories').insert({
        content,
        image_url,
        audio_url,
        privacy,
        is_anonymous: isAnonymous,
        is_draft: isDraft,
        sensitive,
      })
      if (insertError) throw insertError
      setContent('')
      setImageFile(null)
      setAudioBlob(null)
      alert('Saved!')
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {error ? <div className="rounded-md bg-bgError p-2 text-sm text-error">{error}</div> : null}
      <Textarea
        required
        placeholder="Share something real…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
      />
      <div className="flex items-center gap-3 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          Post anonymously
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} />
          Save as draft
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={sensitive} onChange={(e) => setSensitive(e.target.checked)} />
          Mark sensitive
        </label>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="privacy"
            checked={privacy === 'public'}
            onChange={() => setPrivacy('public')}
          />
          Public
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="privacy"
            checked={privacy === 'followers'}
            onChange={() => setPrivacy('followers')}
          />
          Followers
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        {!recording ? (
          <Button type="button" onClick={startRecording} variant="secondary">
            Record audio
          </Button>
        ) : (
          <Button type="button" onClick={stopRecording} variant="secondary">
            Stop
          </Button>
        )}
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Share'}
      </Button>
    </form>
  )
}
