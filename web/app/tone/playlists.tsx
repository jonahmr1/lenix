'use client'

import { useId, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MusicNotesIcon, PlusIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createPlaylist } from './playlist-actions'
import type { Playlist } from './playlist-data'

export function Playlists({
  playlists,
  error,
  selectedId,
  onSelect,
}: {
  playlists: Playlist[]
  error: string | null
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const inputId = useId()
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      try {
        const result = await createPlaylist(formData)
        if ('error' in result) {
          toast.error(result.error)
          return
        }
        setName('')
        setCreating(false)
        onSelect(result.id)
        toast.success('Playlist created.')
      } catch {
        toast.error('Couldn’t reach the server. Please try again.')
      }
    })
  }

  return (
    <div className="space-y-5 p-5">
      <Dialog
        open={creating}
        onOpenChange={open => {
          if (pending) return
          setCreating(open)
          if (!open) setName('')
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="h-10 w-full gap-2 text-sm">
            <PlusIcon aria-hidden="true" />
            Create playlist
          </Button>
        </DialogTrigger>
        <DialogContent className="not-typeset" showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Create playlist</DialogTitle>
            <DialogDescription>Give your playlist a name.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3" aria-busy={pending}>
            <Label htmlFor={inputId}>Playlist name</Label>
            <Input
              id={inputId}
              name="name"
              autoFocus
              required
              maxLength={100}
              value={name}
              onChange={event => setName(event.target.value)}
              disabled={pending}
              placeholder="Give it a name"
              className="h-10 text-base"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending}
                  className="h-10 text-sm"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={pending || !name.trim()}
                className="h-10 gap-2 text-sm"
              >
                {pending && <Spinner aria-hidden="true" />}
                {pending ? 'Creating…' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {error ? (
        <Button
          variant="outline"
          className="h-10 w-full text-sm"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
        >
          {pending ? 'Loading…' : 'Retry loading playlists'}
        </Button>
      ) : playlists.length ? (
        <ul className="space-y-1" aria-label="Your playlists">
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <Button
                variant={selectedId === playlist.id ? 'secondary' : 'ghost'}
                aria-current={selectedId === playlist.id ? 'true' : undefined}
                onClick={() => onSelect(playlist.id)}
                className="h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-left text-sm"
              >
                <MusicNotesIcon aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">
                  {playlist.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {playlist.trackCount}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No playlists yet. Create your first one.
        </p>
      )}
    </div>
  )
}
