import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { StorySchema } from '@/lib/validation'
import { checkBlockedWords } from '@/lib/blocklist'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = StorySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid', issues: parsed.error.flatten() }, { status: 400 })

  const blocked = checkBlockedWords(parsed.data.content)
  if (blocked.length) return NextResponse.json({ error: 'Blocked terms', blocked }, { status: 400 })

  const { error } = await supabase.from('stories').insert({
    ...parsed.data,
    author_id: user.id,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
