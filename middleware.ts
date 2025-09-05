import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/ssr'

const PROTECTED_PREFIXES = ['/compose', '/settings', '/collections', '/resonate', '/moderation']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = new URL(req.url)
  const needsAuth = PROTECTED_PREFIXES.some((p) => url.pathname.startsWith(p))
  if (needsAuth && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return res
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
