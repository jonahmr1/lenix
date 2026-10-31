import { createClient } from '@/lib/supabase.server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, host, protocol } = new URL(request.url)
  const forwardedHost =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    host
  const forwardedProtocol =
    request.headers.get('x-forwarded-proto') ?? protocol.slice(0, -1)
  const origin = `${forwardedProtocol}://${forwardedHost}`
  const code = searchParams.get('code')
  const cookieStore = await cookies()
  const savedPath = cookieStore.get('tone_return_to')?.value
  const returnTo =
    savedPath &&
    /^\/tone\/playlist\/[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(
      savedPath
    )
      ? savedPath
      : '/tone'
  cookieStore.set('tone_return_to', '', { path: '/auth/callback', maxAge: 0 })
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? returnTo
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/tone'
  }

  if (code) {
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/tone?auth-code-error=sign_in`)
}
