import type { Metadata } from 'next'
import Image from 'next/image'
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
    <main className="not-typeset flex h-screen bg-background text-foreground portrait:flex-col portrait:flex-col-reverse">
      <section
        aria-label="Tone account"
        className="flex flex-1 items-center justify-center p-6"
      >
        <div className="w-full max-w-sm">
          <Suspense fallback={<AuthLoading />}>
            <Account searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <div className="relative flex-1 overflow-hidden bg-neutral-950 text-white">
        <Image
          src="/tone/sign-in-artwork.webp"
          alt=""
          fill
          preload
          sizes="(orientation: portrait) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/40" />
        <p className="absolute top-7 left-6 text-3xl font-medium tracking-tight sm:left-10 lg:top-10">
          Tone
        </p>
        <p className="absolute right-10 bottom-10 left-10 text-3xl font-light tracking-tight text-white/90 lg:block xl:text-4xl">
          Find your rhythm.
        </p>
      </div>
    </main>
  )
}
