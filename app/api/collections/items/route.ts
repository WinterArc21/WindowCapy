import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, story_id } = await req.json()
  // Ensure collection exists (create if missing)
  const { data: existing } = await supabase
    .from('collections')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', name)
    .maybeSingle()
  let collection_id = existing?.id as string | undefined
  if (!collection_id) {
    const { data: created, error } = await supabase
      .from('collections')
      .insert({ user_id: user.id, name })
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    collection_id = created.id
  }
  const { error: addErr } = await supabase.from('collection_items').insert({ collection_id, story_id })
  if (addErr) return NextResponse.json({ error: addErr.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, story_id } = await req.json()
  const { data: collection } = await supabase
    .from('collections')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', name)
    .single()
  if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  const { error } = await supabase
    .from('collection_items')
    .delete()
    .eq('collection_id', collection.id)
    .eq('story_id', story_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
