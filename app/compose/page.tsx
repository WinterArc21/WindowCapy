import ComposeForm from '@/components/story/ComposeForm'
import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'

export default async function ComposePage() {
  const supabase = supabaseServer()
  const { data: session } = await supabase?.auth.getSession()!
  const user = session?.session?.user
  let drafts: any[] = []
  if (user && supabase) {
    const { data } = await supabase
      .from('stories')
      .select('id, content, created_at')
      .eq('author_id', user.id)
      .eq('is_draft', true)
      .order('created_at', { ascending: false })
    drafts = data ?? []
  }

  async function publish(formData: FormData) {
    'use server'
    const id = String(formData.get('id'))
    const supabase = supabaseServer()!
    await supabase.from('stories').update({ is_draft: false }).eq('id', id)
  }

  return (
    <main className='mx-auto max-w-2xl p-4 space-y-4'>
      <h1 className='text-2xl font-semibold'>Compose</h1>
      <ComposeForm />
      {drafts.length > 0 && (
        <section className='space-y-2'>
          <h2 className='text-lg font-semibold'>Drafts</h2>
          <ul className='space-y-2'>
            {drafts.map((d) => (
              <li key={d.id} className='flex items-center justify-between rounded-lg border border-outline p-2'>
                <div className='text-sm line-clamp-2'>{d.content}</div>
                <form action={publish}>
                  <input type='hidden' name='id' value={d.id} />
                  <Button type='submit' variant='secondary'>Publish</Button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
