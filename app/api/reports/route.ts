import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { target_type, target_id, reason, details } = await req.json()
  const { error } = await supabase
    .from('reports')
    .insert({ target_type, target_id, reason, details: details || null, reporter_id: user.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
