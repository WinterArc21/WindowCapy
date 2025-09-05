import { supabaseServer } from '@/lib/supabase-server'

export default async function PromptCard() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from('prompts')
    .select('id, title, body, cadence, active_from, active_to')
    .lte('active_from', today)
    .or('active_to.is.null,active_to.gte.' + today)
    .order('active_from', { ascending: false })
    .limit(1)
  const p = data?.[0]
  if (!p) return null
  return (
    <div className="rounded-xl border border-outline bg-bgMuted p-3">
      <div className="text-xs uppercase tracking-wide text-text/60">Today’s prompt</div>
      <div className="text-sm font-medium">{p.title}</div>
      {p.body ? <div className="text-sm text-text/80">{p.body}</div> : null}
    </div>
  )
}
