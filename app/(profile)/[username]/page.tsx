import { supabaseServer } from '@/lib/supabase-server'
import FollowButton from '@/components/profile/FollowButton'
import Avatar from '@/components/ui/Avatar'
import ReportButton from '@/components/story/ReportButton'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', params.username).single()
  if (!profile) return <main className="mx-auto max-w-2xl p-4">Profile not found.</main>

  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  const isSelf = user?.id === profile.id

  const [{ count: followers }, { count: following }, { data: isFollowingData }] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followee_id', profile.id),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id),
    user
      ? supabase.from('follows').select('follower_id').eq('follower_id', user.id).eq('followee_id', profile.id).maybeSingle()
      : Promise.resolve({ data: null } as any),
  ])

  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <header className="flex items-center gap-3">
        <Avatar src={profile.avatar_url} alt={profile.display_name} size={56} />
        <div>
          <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
          <div className="text-sm text-text/70">@{profile.username}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!isSelf && (
            <>
              <FollowButton targetId={profile.id} isFollowing={Boolean(isFollowingData)} />
              <ReportButton targetType="profile" targetId={profile.id} />
            </>
          )}
        </div>
      </header>
      <section className="grid gap-2 rounded-xl border border-outline p-3">
        {profile.bio && <p><strong>Who I am:</strong> {profile.bio}</p>}
        {profile.family && <p><strong>Family:</strong> {profile.family}</p>}
        {profile.matters && <p><strong>What matters:</strong> {profile.matters}</p>}
        {profile.current && <p><strong>Going through:</strong> {profile.current}</p>}
      </section>
      {profile.show_follower_counts && (
        <div className="text-sm text-text/70">{followers ?? 0} followers • {following ?? 0} following</div>
      )}
    </main>
  )
}
