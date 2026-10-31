import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { isAuthSessionMissingError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase.server'
import { AuthControls, AuthLoading } from './auth-controls'
import { AppShell } from './app-shell'
import { readPlaylists } from './playlist-data'
import artwork from './assets/sign-in-artwork.webp'

export const metadata: Metadata = {
  title: 'Tonelix',
  description: 'Sign in to Tonelix with your Google account.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

async function Account({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient(await cookies())
  const params = await searchParams
  let account: { id: string; email: string | null } | null = null
  let message = params['auth-code-error']
    ? 'Sign-in wasn’t completed. Please try again.'
    : null

  try {
    const { data, error } = await supabase.auth.getUser()
    if (data.user) {
      account = { id: data.user.id, email: data.user.email ?? null }
      message = null
    } else if (error && !isAuthSessionMissingError(error)) {
      message = 'We couldn’t verify your session. Please try signing in again.'
    }
  } catch {
    message = 'We couldn’t reach the sign-in service. Please try again.'
  }

  if (account) {
    const { playlists, error } = await readPlaylists(supabase, account.id)
    return (
      <AppShell
        email={account.email}
        playlists={playlists}
        playlistError={error}
      />
    )
  }

  return <SignIn initialMessage={message} />
}

export default function TonePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <Suspense fallback={<AuthLoading />}>
      <Account searchParams={searchParams} />
    </Suspense>
  )
}

function SignIn({ initialMessage }: { initialMessage: string | null }) {
  return (
    <main className="not-typeset flex h-screen bg-background text-foreground portrait:flex-col-reverse">
      <section
        aria-label="Tonelix account"
        className="flex flex-1 items-center justify-center p-6"
      >
        <div className="w-full max-w-sm">
          <AuthControls account={null} initialMessage={initialMessage} />
        </div>
      </section>

      <div className="relative flex-1 overflow-hidden bg-neutral-950 text-white">
        <Image
          src={artwork}
          alt=""
          fill
          preload
          sizes="(orientation: portrait) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/40" />
        <p className="absolute top-7 right-6 text-3xl font-medium tracking-tight sm:right-10 lg:top-10">
          Tonelix
        </p>
        <p className="absolute right-10 bottom-10 text-3xl font-light tracking-tight text-white/90 lg:block xl:text-4xl">
          Find your rhythm.
        </p>
      </div>
    </main>
  )
}
