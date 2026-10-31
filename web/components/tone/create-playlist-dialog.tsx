'use client'
import { useId, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon } from '@phosphor-icons/react'
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
import { createPlaylist } from '@/lib/tone/playlist-actions'

export function CreatePlaylistDialog({ onCreated }: { onCreated: () => void }) {
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
        onCreated()
        router.push(`/tone/playlist/${result.id}`)
        toast.success('Playlist created.')
      } catch {
        toast.error('Couldn’t reach the server. Please try again.')
      }
    })
  }

  return (
    <Dialog
      open={creating}
      onOpenChange={open => {
        if (pending) return
        setCreating(open)
        if (!open) setName('')
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Create playlist"
          className="size-11 transition-opacity duration-200 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/create-playlist:opacity-100 [@media(hover:hover)]:group-focus-within/create-playlist:opacity-100 data-[state=open]:opacity-100"
        >
          <PlusIcon aria-hidden="true" />
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
  )
}
