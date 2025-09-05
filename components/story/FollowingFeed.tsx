import { supabaseServer } from '@/lib/supabase-server'

export default async function FollowingFeed() {
  const supabase = supabaseServer()
  if (!supabase) return <div className="text-sm text-text/60">Connect Supabase to load Following.</div>
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return <div className="text-sm text-text/60">Sign in to see Following.</div>
  return <div className="text-sm text-text/60">Following feed is coming soon.</div>
}
