import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from './StoryCard'

export default async function FollowingFeed() {
  const supabase = supabaseServer()
  if (!supabase) return <div className="text-sm text-text/60">Connect Supabase to load Following.</div>
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return <div className="text-sm text-text/60">Sign in to see Following.</div>

  const { data: follows } = await supabase
    .from('follows')
    .select('followee_id')
    .eq('follower_id', user.id)
  const ids = (follows ?? []).map((f) => f.followee_id)
  if (!ids.length) return <div className="text-sm text-text/60">You are not following anyone yet.</div>

  const { data, error } = await supabase
    .from('stories')
    .select('id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at')
    .eq('is_draft', false)
    .in('author_id', ids)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return <div className="text-sm text-error">Failed to load following.</div>
  const stories = data ?? []
  return (
    <div className="space-y-3">
      {stories.map((s) => (
        <StoryCard key={s.id} story={s as any} />
      ))}
    </div>
  )
}
