import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from '@/components/story/StoryCard'
import { notFound } from 'next/navigation'
import CommentThread from '@/components/story/CommentThread'
import ReportButton from '@/components/story/ReportButton'
import { getAudioSignedUrl } from '@/lib/storage'

export default async function StoryDetail({ params }: { params: { id: string } }) {
  const supabase = supabaseServer()
  if (!supabase) return notFound()
  const { data } = await supabase
    .from('stories')
    .select('id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at')
    .eq('id', params.id)
    .single()
  if (!data) return notFound()
  const { data: actioned } = await supabase
    .from('reports')
    .select('id')
    .eq('target_type', 'story')
    .eq('target_id', params.id)
    .eq('status', 'actioned')
    .maybeSingle()
  if (actioned) return notFound()

  const signed = data.audio_url ? await getAudioSignedUrl(data.audio_url) : null
  const story = { ...data, audio_url: signed }

  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Story</h1>
        <ReportButton targetType="story" targetId={params.id} />
      </div>
      <StoryCard story={story as any} />
      <CommentThread storyId={params.id} />
    </main>
  )
}
