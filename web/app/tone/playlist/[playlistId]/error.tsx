'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function PlaylistError({ retry }: { retry: () => void }) {
  useEffect(() => {
    const id = toast.error('Couldn’t load this playlist. Please try again.', {
      id: 'tone-playlist-error',
    })
    return () => {
      toast.dismiss(id)
    }
  }, [])

  return (
    <div className="flex flex-1 items-center justify-center">
      <Button variant="outline" className="h-10" onClick={retry}>
        Retry loading playlist
      </Button>
    </div>
  )
}
