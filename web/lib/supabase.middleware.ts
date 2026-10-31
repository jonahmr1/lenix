import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { supabaseKey, supabaseUrl } from './supabase'

export const createClient = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
        Object.entries(headers).forEach(([name, value]) =>
          supabaseResponse.headers.set(name, value)
        )
      },
    },
  })

  // Refresh cookies before Server Components read them. The page verifies
  // the current user separately; this helper is not an authorization check.
  try {
    await supabase.auth.getClaims()
  } catch {
    // Keep the sign-in screen available during an auth-service outage.
  }
  supabaseResponse.headers.set('Cache-Control', 'private, no-store')
  return supabaseResponse
}
