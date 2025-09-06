import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { checkBlockedWords } from '@/lib/blocklist'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const story_id = url.searchParams.get('story_id')
  if (!story_id) return NextResponse.json({ error: 'story_id required' }, { status: 400 })
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data, error } = await supabase
    .from('comments')
    .select('id, content, author_id, parent_id, created_at')
    .eq('story_id', story_id)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ comments: data ?? [] })
}

export async function POST(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { story_id, content, parent_id } = await req.json()
  const blocked = checkBlockedWords(String(content || ''))
  if (blocked.length) return NextResponse.json({ error: 'Blocked terms', blocked }, { status: 400 })
  const { error } = await supabase.from('comments').insert({ story_id, content, parent_id: parent_id || null, author_id: user.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
