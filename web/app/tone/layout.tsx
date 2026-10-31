import type { Metadata } from 'next'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { isAuthSessionMissingError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase.server'
import { AuthLoading } from '@/components/tone/auth-loading'
import { SignIn } from '@/components/tone/sign-in'
import { AppShell } from '@/components/tone/app-shell'
import { readPlaylists } from './playlist-data'

export const metadata: Metadata = {
  title: 'Tonelix',
  description: 'Sign in to Tonelix with your Google account.',
}

async function Account({ children }: { children: React.ReactNode }) {
  const supabase = createClient(await cookies())
  let account: {
    id: string
    email: string | null
    name: string | null
    avatarUrl: string | null
  } | null = null
  let message: string | null = null

  try {
    const { data, error } = await supabase.auth.getUser()
    if (data.user) {
      const metadata = data.user.user_metadata
      const name = metadata.full_name ?? metadata.name
      const avatarUrl = metadata.avatar_url ?? metadata.picture
      account = {
        id: data.user.id,
        email: data.user.email ?? null,
        name: typeof name === 'string' ? name.trim() || null : null,
        avatarUrl: typeof avatarUrl === 'string' ? avatarUrl : null,
      }
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
        name={account.name}
        avatarUrl={account.avatarUrl}
        playlists={playlists}
        playlistError={error}
      >
        {children}
      </AppShell>
    )
  }

  return <SignIn initialMessage={message} />
}

export default function ToneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<AuthLoading />}>
      <Account>{children}</Account>
    </Suspense>
  )
}
