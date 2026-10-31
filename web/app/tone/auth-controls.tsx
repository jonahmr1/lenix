'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GoogleLogoIcon, SignOutIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase.client'

type Account = { email: string | null }

export function AuthLoading() {
  useEffect(() => {
    const id = toast.loading('Checking your session…')
    return () => {
      toast.dismiss(id)
    }
  }, [])

  return null
}

export function AuthControls({
  account,
  initialMessage,
  compact = false,
}: {
  account: Account | null
  initialMessage: string | null
  compact?: boolean
}) {
  const [pending, setPending] = useState(false)
  useEffect(() => {
    if (!initialMessage) return
    const id = toast.error(initialMessage, { id: 'tone-auth-error' })
    return () => {
      toast.dismiss(id)
    }
  }, [initialMessage])

  async function signIn() {
    if (pending) return
    setPending(true)
    toast.dismiss('tone-auth-error')
    try {
      const { data, error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      })
      if (error || !data.url) throw new Error('Sign-in unavailable')
      window.location.assign(data.url)
    } catch {
      toast.error('Couldn’t open Google sign-in. Please try again.', {
        id: 'tone-auth-error',
      })
      setPending(false)
    }
  }

  async function signOut() {
    if (pending) return
    setPending(true)
    toast.dismiss('tone-auth-error')
    try {
      const { error } = await createClient().auth.signOut({ scope: 'local' })
      if (error) throw error
      window.location.replace('/tone')
    } catch {
      toast.error('Couldn’t sign out. Please try again.', {
        id: 'tone-auth-error',
      })
      setPending(false)
    }
  }

  return (
    <div className="space-y-8">
      {!compact && (
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
            {account ? 'Your account' : 'Welcome to Tonelix'}
          </h1>
        </div>
      )}

      {account && !compact && (
        <div className="rounded-md border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="mt-1 text-sm font-medium break-all">
            {account.email ?? 'Your Google account'}
          </p>
        </div>
      )}

      <Button
        type="button"
        variant={account ? 'outline' : 'default'}
        className={
          compact ? 'h-10 gap-2 px-3 text-sm' : 'h-12 w-full gap-3 text-base'
        }
        disabled={pending}
        aria-busy={pending}
        onClick={account ? signOut : signIn}
      >
        {pending ? (
          <Spinner aria-hidden="true" />
        ) : account ? (
          <SignOutIcon aria-hidden="true" />
        ) : (
          <GoogleLogoIcon aria-hidden="true" />
        )}
        {pending
          ? account
            ? 'Signing out…'
            : 'Opening Google…'
          : account
            ? 'Sign out'
            : 'Continue with Google'}
      </Button>
    </div>
  )
}
