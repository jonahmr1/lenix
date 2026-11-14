'use client'
import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function TrackError({ message }: { message: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  useEffect(() => {
    toast.error(message, { id: 'tone-tracks-error' })
  }, [message])
  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending && <Spinner />} Retry loading tracks
    </Button>
  )
}
