import { supabaseServer } from '@/lib/supabase-server'
import StoryCard from '@/components/story/StoryCard'

export default async function ResonatePage() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return <main className="mx-auto max-w-2xl p-4">Sign in to see reactions.</main>

  const { data: myReactions } = await supabase
    .from('reactions')
    .select('story_id')
    .eq('reactor_id', user.id)
  const storyIds = Array.from(new Set((myReactions ?? []).map((r) => r.story_id)))
  if (!storyIds.length) return <main className="mx-auto max-w-2xl p-4">No reactions yet.</main>

  const { data } = await supabase
    .from('stories')
    .select('id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at')
    .in('id', storyIds)
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-2xl p-4 space-y-3">
      <h1 className="text-2xl font-semibold">Resonate</h1>
      {(data ?? []).map((s) => (
        <StoryCard key={s.id} story={s as any} />
      ))}
    </main>
  )
}
