import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Inputs'

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server'
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const supabase = supabaseServer()
    if (!supabase) return redirect('/register')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return redirect('/login?error=1')
    redirect('/')
  }
  return (
    <form action={login} className="mx-auto mt-10 max-w-sm space-y-3 p-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <label className="block text-sm">
        Email
        <Input name="email" type="email" required className="mt-1" />
      </label>
      <label className="block text-sm">
        Password
        <Input name="password" type="password" required className="mt-1" />
      </label>
      <Button type="submit" className="w-full">Continue</Button>
    </form>
  )
}
