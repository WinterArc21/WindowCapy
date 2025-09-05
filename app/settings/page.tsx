import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Inputs'

export default async function SettingsPage() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  async function save(formData: FormData) {
    'use server'
    const supabase = supabaseServer()!
    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user
    if (!user) return redirect('/login')
    const payload = {
      id: user.id,
      username: String(formData.get('username') || '').trim(),
      display_name: String(formData.get('display_name') || '').trim(),
      bio: String(formData.get('bio') || '').trim() || null,
      family: String(formData.get('family') || '').trim() || null,
      matters: String(formData.get('matters') || '').trim() || null,
      current: String(formData.get('current') || '').trim() || null,
      show_follower_counts: formData.get('show_follower_counts') === 'on',
    }
    await supabase.from('profiles').upsert(payload)
    redirect(`/${payload.username}`)
  }

  return (
    <form action={save} className="mx-auto mt-10 max-w-xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="grid grid-cols-1 gap-3">
        <label className="block text-sm">
          Username
          <Input name="username" required defaultValue={profile?.username || ''} className="mt-1" />
        </label>
        <label className="block text-sm">
          Display name
          <Input name="display_name" required defaultValue={profile?.display_name || ''} className="mt-1" />
        </label>
        <label className="block text-sm">
          Who I am
          <Textarea name="bio" rows={2} defaultValue={profile?.bio || ''} className="mt-1" />
        </label>
        <label className="block text-sm">
          Family
          <Textarea name="family" rows={2} defaultValue={profile?.family || ''} className="mt-1" />
        </label>
        <label className="block text-sm">
          What matters to me
          <Textarea name="matters" rows={2} defaultValue={profile?.matters || ''} className="mt-1" />
        </label>
        <label className="block text-sm">
          What I’m going through
          <Textarea name="current" rows={2} defaultValue={profile?.current || ''} className="mt-1" />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-outline p-3">
          <span>Show follower counts</span>
          <input name="show_follower_counts" type="checkbox" defaultChecked={profile?.show_follower_counts ?? true} />
        </label>
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}
