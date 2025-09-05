import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'

export default async function ModerationQueuePage() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return null
  // Attempt to select reports; policy restricts to moderator role
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, target_type, target_id, reason, details, status, created_at, reporter_id')
    .eq('status', 'open')
    .order('created_at', { ascending: true })
  if (error) return <main className="mx-auto max-w-3xl p-4">Moderator access required.</main>

  async function updateStatus(formData: FormData) {
    'use server'
    const supabase = supabaseServer()!
    const id = String(formData.get('id'))
    const status = String(formData.get('status'))
    await supabase.from('reports').update({ status }).eq('id', id)
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Moderation Queue</h1>
      <ul className="space-y-2">
        {(reports ?? []).map((r) => (
          <li key={r.id} className="rounded-lg border border-outline p-3">
            <div className="text-sm">{r.target_type} • {r.reason}</div>
            {r.details && <div className="text-sm text-text/70">{r.details}</div>}
            <form action={updateStatus} className="mt-2 flex items-center gap-2">
              <input type="hidden" name="id" value={r.id} />
              <Button type="submit" name="status" value="reviewed" variant="secondary">Mark reviewed</Button>
              <Button type="submit" name="status" value="actioned">Mark actioned</Button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  )
}
