import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from './StoryCard'
import { getAudioSignedUrl } from '@/lib/storage'

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

  const authorIds = Array.from(new Set(stories.map((s) => s.author_id)))
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', authorIds)
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const actionedStoryIds = new Set<string>()
  const { data: actioned } = await supabase
    .from('reports')
    .select('target_id')
    .eq('target_type', 'story')
    .eq('status', 'actioned')
  actioned?.forEach((r) => actionedStoryIds.add(r.target_id as string))

  const withMedia = await Promise.all(
    stories.map(async (s) => ({
      ...s,
      author: profileMap.get(s.author_id) || null,
      audio_url: s.audio_url ? await getAudioSignedUrl(s.audio_url) : null,
    }))
  )

  return (
    <div className="space-y-3">
      {withMedia
        .filter((s) => !actionedStoryIds.has(s.id as any))
        .map((s) => (
          <StoryCard key={s.id} story={s as any} />
        ))}
    </div>
  )
}
