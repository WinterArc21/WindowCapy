import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'

export default async function SettingsPage() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  async function update(formData: FormData) {
    'use server'
    const show = formData.get('show') === 'on'
    const supabase = supabaseServer()!
    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, show_follower_counts: show })
  }

  return (
    <form action={update} className="mx-auto mt-10 max-w-xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <label className="flex items-center justify-between rounded-xl border border-outline p-3">
        <span>Show follower counts</span>
        <input name="show" type="checkbox" defaultChecked={profile?.show_follower_counts ?? true} />
      </label>
      <Button type="submit">Save</Button>
    </form>
  )
}
