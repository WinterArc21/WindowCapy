import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from './StoryCard'

export default async function FollowingFeed() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return <div className="text-sm text-text/60">Sign in to see Following.</div>

  const { data, error } = await supabase
    .from('stories')
    .select('id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at')
    .eq('is_draft', false)
    .in('author_id', supabase
      .from('follows')
      // This placeholder will be replaced with a server action route in future
      // Using RPC or view would be better; keeping simple for MVP scaffold
    )

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
