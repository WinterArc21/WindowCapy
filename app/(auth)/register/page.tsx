import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Inputs'

export default function RegisterPage() {
  async function register(formData: FormData) {
    'use server'
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const supabase = supabaseServer()
    if (!supabase) return redirect('/login')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return redirect('/register?error=1')
    redirect('/settings')
  }
  return (
    <form action={register} className="mx-auto mt-10 max-w-sm space-y-3 p-4">
      <h1 className="text-xl font-semibold">Create account</h1>
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
