import type { Metadata } from 'next'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { isAuthSessionMissingError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase.server'
import { AuthControls, AuthLoading } from './auth-controls'

export const metadata: Metadata = {
  title: 'Tone',
  description: 'Sign in to Tone with your Google account.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

async function Account({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient(await cookies())
  const params = await searchParams
  let account: { email: string | null } | null = null
  let message = params['auth-code-error']
    ? 'Sign-in wasn’t completed. Please try again.'
    : null

  try {
    const { data, error } = await supabase.auth.getUser()
    if (data.user) {
      account = { email: data.user.email ?? null }
      message = null
    } else if (error && !isAuthSessionMissingError(error)) {
      message = 'We couldn’t verify your session. Please try signing in again.'
    }
  } catch {
    message = 'We couldn’t reach the sign-in service. Please try again.'
  }

  return <AuthControls account={account} initialMessage={message} />
}

export default function TonePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <main className="not-typeset flex min-h-svh items-center justify-center bg-background px-6 py-12 text-foreground">
      <section aria-label="Tone account" className="w-full max-w-sm">
        <h1 className="mb-10 text-2xl font-semibold tracking-tight">Tone</h1>
        <Suspense fallback={<AuthLoading />}>
          <Account searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  )
}
