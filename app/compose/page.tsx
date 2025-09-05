import ComposeForm from '@/components/story/ComposeForm'
export default function ComposePage() {
  return (
    <main className='mx-auto max-w-2xl p-4 space-y-4'>
      <h1 className='text-2xl font-semibold'>Compose</h1>
      <ComposeForm />
    </main>
  )
}
