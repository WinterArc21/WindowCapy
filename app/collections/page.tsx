import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Inputs'
import StoryCard from '@/components/story/StoryCard'

export default async function CollectionsPage() {
  const supabase = supabaseServer()
  if (!supabase) return null
  const { data: session } = await supabase.auth.getSession()
  const user = session?.session?.user
  if (!user) return <main className="mx-auto max-w-2xl p-4">Sign in to manage collections.</main>

  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, description, created_at')
    .eq('user_id', user.id)

  async function createCollection(formData: FormData) {
    'use server'
    const name = String(formData.get('name') || '').trim()
    const desc = String(formData.get('description') || '').trim()
    const supabase = supabaseServer()!
    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user
    if (!user) return
    await supabase.from('collections').insert({ user_id: user.id, name, description: desc || null })
  }

  async function getItems(collectionId: string) {
    'use server'
  }

  // Load items for first collection (simple MVP)
  let items: any[] = []
  if (collections && collections[0]) {
    const { data: rows } = await supabase
      .from('collection_items')
      .select('story:stories(id, content, image_url, audio_url, author_id, privacy, is_anonymous, sensitive, created_at)')
      .eq('collection_id', collections[0].id)
      .order('created_at', { ascending: false })
    items = (rows ?? []).map((r: any) => r.story)
  }

  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Collections</h1>
      <form action={createCollection} className="flex gap-2">
        <Input name="name" placeholder="New collection name" required />
        <Input name="description" placeholder="Description (optional)" />
        <Button type="submit">Create</Button>
      </form>
      <ul className="space-y-1 text-sm">
        {(collections ?? []).map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border border-outline p-2">
            <div>
              <div className="font-medium">{c.name}</div>
              {c.description ? <div className="text-text/70">{c.description}</div> : null}
            </div>
            <div className="text-xs text-text/60">{new Date(c.created_at!).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {collections && collections.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{collections[0].name}</h2>
          {items.map((s) => (
            <StoryCard key={s.id} story={s as any} />
          ))}
        </section>
      )}
    </main>
  )
}
