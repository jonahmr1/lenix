import { createClient } from '@/lib/supabase.server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, host, protocol } = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? host
  const forwardedProtocol = request.headers.get('x-forwarded-proto') ?? protocol.slice(0, -1)
  const origin = `${forwardedProtocol}://${forwardedHost}`
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/tone'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/tone'
  }

  if (code) {
    const supabase = createClient(await cookies())
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/tone?auth-code-error=sign_in`)
}
