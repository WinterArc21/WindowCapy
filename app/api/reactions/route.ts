import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const story_id = url.searchParams.get('story_id')
  if (!story_id) return NextResponse.json({ error: 'story_id required' }, { status: 400 })
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const [{ data: counts }, { data: session }] = await Promise.all([
    supabase
      .from('reactions')
      .select('type, count:count(*)')
      .eq('story_id', story_id)
      .group('type'),
    supabase.auth.getSession(),
  ])
  const user = session?.session?.user
  let mine: string[] = []
  if (user) {
    const { data: my } = await supabase
      .from('reactions')
      .select('type')
      .eq('story_id', story_id)
      .eq('reactor_id', user.id)
    mine = (my ?? []).map((r) => r.type as string)
  }
  return NextResponse.json({ counts: counts ?? [], mine })
}

export async function POST(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { story_id, type } = await req.json()
  // Toggle logic: delete if exists else insert
  const { data: exists } = await supabase
    .from('reactions')
    .select('id')
    .eq('story_id', story_id)
    .eq('reactor_id', user.id)
    .eq('type', type)
    .maybeSingle()
  if (exists) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', exists.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, toggled: 'off' })
  } else {
    const { error } = await supabase
      .from('reactions')
      .insert({ story_id, reactor_id: user.id, type })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, toggled: 'on' })
  }
}
