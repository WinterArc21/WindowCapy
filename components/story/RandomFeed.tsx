import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from './StoryCard'

export default async function RandomFeed() {
  const supabase = supabaseServer()
  if (!supabase) {
    return <div className="text-sm text-text/60">Connect Supabase to load stories.</div>
  }
  const { data, error } = await supabase
    .from('stories')
    .select('id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at')
    .eq('is_draft', false)
    .eq('privacy', 'public')
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) return <div className="text-sm text-error">Failed to load stories.</div>
  const stories = (data ?? []).sort(() => Math.random() - 0.5)
  return (
    <div className="space-y-3">
      {stories.map((s) => (
        <StoryCard key={s.id} story={s as any} />
      ))}
    </div>
  )
}
