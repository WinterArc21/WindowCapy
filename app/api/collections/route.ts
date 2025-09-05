import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabase
    .from('collections')
    .select('id, name, description, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return NextResponse.json({ collections: data ?? [] })
}

export async function POST(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, description } = await req.json()
  const { error } = await supabase.from('collections').insert({ user_id: user.id, name, description: description || null })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
