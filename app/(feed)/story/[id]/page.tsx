import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from '@/components/story/StoryCard'
import { notFound } from 'next/navigation'

export default async function StoryDetail({ params }: { params: { id: string } }) {
  const supabase = supabaseServer()
  if (!supabase) return notFound()
  const { data } = await supabase
    .from('stories')
    .select('id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at')
    .eq('id', params.id)
    .single()
  if (!data) return notFound()
  return (
    <main className="mx-auto max-w-2xl p-4">
      <StoryCard story={data as any} />
    </main>
  )
}
