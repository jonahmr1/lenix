'use client'

import { useApp } from '@/app/tone/provider'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import { createPlaylist } from '@/lib/tone/playlist-actions'

export function CreatePlaylistDialog() {
  const { state, setState } = useApp()
  return (
    <Dialog
      open={state.newPlaylistOpen}
      onOpenChange={newPlaylistOpen =>
        setState(previous => ({ ...previous, newPlaylistOpen }))
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new playlist</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          className='grid gap-4'
          onSubmit={async event => {
            event.preventDefault()
            if (state.playlistSaving) return
            const form = event.currentTarget
            const name = String(new FormData(form).get('name') ?? '').trim()
            if (!name) {
              toast.error('Enter a playlist name.')
              return
            }
            setState(previous => ({
              ...previous,
              playlistSaving: true,
            }))
            let result
            try {
              result = await createPlaylist(new FormData(form))
            } catch {
              toast.error('Couldn’t create your playlist. Please try again.')
              setState(previous => ({
                ...previous,
                playlistSaving: false,
              }))
              return
            }
            if ('error' in result) {
              toast.error(result.error)
              setState(previous => ({
                ...previous,
                playlistSaving: false,
              }))
              return
            }
            const playlist = { id: result.id, name }
            setState(previous => ({
              ...previous,
              playlists: [...previous.playlists, playlist],
              newPlaylistOpen: false,
              playlistSaving: false,
            }))
            form.reset()
          }}
        >
          <Field>
            <FieldLabel htmlFor='playlist-name'>Name</FieldLabel>
            <Input
              id='playlist-name'
              name='name'
              placeholder='e.g. Late night jazz'
              autoComplete='off'
              required
              pattern='.*\S.*'
              className='text-base'
            />
          </Field>
          <DialogFooter>
            <Button
              className='w-full'
              type='submit'
              disabled={state.playlistSaving}
            >
              {state.playlistSaving ? 'Creating…' : 'Create playlist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
