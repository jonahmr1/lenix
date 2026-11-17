'use client'

import { startTransition, useEffect, type ReactNode } from 'react'
import Link, { useLinkStatus } from 'next/link'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/tone/context-menu'
import { PlusIcon, SidebarIcon } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useApp } from './provider'
import { createClient } from '@/lib/supabase.client'

function PlaylistLinkLabel({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus()
  return <span data-pending={pending}>{children}</span>
}

export function AppShell({ children }: { children: ReactNode }) {
  const { playlistId } = useParams<{ playlistId?: string }>()
  const { state, setState } = useApp()
  const router = useRouter()
  const { isMobile, toggleSidebar, setOpenMobile } = useSidebar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !['b', 'm'].includes(event.key.toLowerCase()) ||
        !event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.repeat ||
        (event.target instanceof HTMLElement &&
          event.target.closest(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
          ))
      )
        return

      event.preventDefault()
      if (event.key.toLowerCase() === 'b') {
        toggleSidebar()
        return
      }
      const key = isMobile ? 'queueMobileOpen' : 'queueOpen'
      setState(previous => ({ ...previous, [key]: !previous[key] }))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, setState, toggleSidebar])

  const queueHeader = (
    <SidebarHeader className='flex-row items-center justify-between'>
      Queue
      {!isMobile && (
        <KbdGroup className='p-1' aria-label='Control + M'>
          <Kbd>Ctrl</Kbd>
          <Kbd>M</Kbd>
        </KbdGroup>
      )}
    </SidebarHeader>
  )

  return (
    <>
      <Sidebar variant='inset' aria-label='Playlists'>
        <SidebarHeader className='group/playlists-header flex-row items-center justify-between'>
          Playlists
          <div className='flex items-center gap-2'>
            <Dialog
              open={state.newPlaylistOpen}
              onOpenChange={newPlaylistOpen =>
                setState(previous => ({ ...previous, newPlaylistOpen }))
              }
            >
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon-lg'
                  aria-label='Create playlist'
                  className='opacity-0 group-hover/playlists-header:opacity-100 focus-visible:opacity-100'
                >
                  <PlusIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new playlist</DialogTitle>
                </DialogHeader>
                <form
                  noValidate
                  className='grid gap-4'
                  onSubmit={event => {
                    event.preventDefault()
                    const form = event.currentTarget
                    const name = String(
                      new FormData(form).get('name') ?? ''
                    ).trim()
                    if (!name) {
                      toast.error('Enter a playlist name.')
                      return
                    }
                    const playlist = { id: crypto.randomUUID(), name }
                    setState(previous => ({
                      ...previous,
                      playlists: [...previous.playlists, playlist],
                      newPlaylistOpen: false,
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
                    />
                  </Field>
                  <DialogFooter>
                    <Button className='w-full' type='submit'>
                      Create playlist
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {!isMobile && (
              <KbdGroup className='p-1' aria-label='Control + B'>
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className='not-typeset'>
              {state.playlists.map(playlist => (
                <SidebarMenuItem key={playlist.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={playlistId === playlist.id}
                      >
                        <Link
                          href={`/tone/playlist/${playlist.id}`}
                          className='has-[[data-pending=true]]:cursor-progress'
                          aria-current={
                            playlistId === playlist.id ? 'page' : undefined
                          }
                          onClick={() => setOpenMobile(false)}
                        >
                          <PlaylistLinkLabel>{playlist.name}</PlaylistLinkLabel>
                        </Link>
                      </SidebarMenuButton>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onSelect={() =>
                          setState(previous => ({
                            ...previous,
                            playlistAction: { type: 'rename', ...playlist },
                          }))
                        }
                      >
                        Rename
                      </ContextMenuItem>
                      <ContextMenuItem
                        variant='destructive'
                        onSelect={() =>
                          setState(previous => ({
                            ...previous,
                            playlistAction: { type: 'delete', ...playlist },
                          }))
                        }
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail
          aria-label='Toggle playlists'
          title='Toggle playlists (Ctrl+B)'
          aria-keyshortcuts='Control+b'
          className='after:inset-y-2 after:w-4 after:rounded-l-xl after:border-y-2 after:border-l-2 after:border-transparent hover:after:border-sidebar-border hover:after:bg-transparent'
        />
      </Sidebar>
      <Dialog
        open={state.playlistAction !== null}
        onOpenChange={open => {
          if (!open && !state.playlistSaving)
            setState(previous => ({
              ...previous,
              playlistAction: null,
            }))
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {state.playlistAction?.type === 'rename'
                ? 'Rename playlist'
                : 'Delete playlist?'}
            </DialogTitle>
            {state.playlistAction?.type === 'delete' && (
              <DialogDescription>
                Delete{' '}
                <b className='font-black'>{state.playlistAction?.name}</b>? This
                cannot be undone
              </DialogDescription>
            )}
          </DialogHeader>
          <form
            noValidate
            className='grid gap-4'
            onSubmit={async event => {
              event.preventDefault()
              const action = state.playlistAction
              if (!action || state.playlistSaving) return
              const name = String(
                new FormData(event.currentTarget).get('name') ?? ''
              ).trim()
              if (action.type === 'rename' && !name) {
                toast.error('Enter a playlist name.')
                return
              }
              setState(previous => ({
                ...previous,
                playlistSaving: true,
              }))
              try {
                const supabase = createClient()
                const {
                  data: { user },
                  error: authError,
                } = await supabase.auth.getUser()
                if (authError || !user) throw new Error('Please sign in again.')
                const query =
                  action.type === 'rename'
                    ? supabase.from('playlists').update({ label: name })
                    : supabase.from('playlists').delete()
                const { data, error } = await query
                  .eq('id', action.id)
                  .eq('user_id', user.id)
                  .select('id')
                  .single()
                if (error || !data)
                  throw new Error(
                    `Couldn’t ${action.type} your playlist. Please try again.`
                  )
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.'
                )
                setState(previous => ({
                  ...previous,
                  playlistSaving: false,
                }))
                return
              }
              startTransition(() => {
                if (action.type === 'delete' && playlistId === action.id)
                  router.replace('/tone')
                setState(previous => ({
                  ...previous,
                  playlists:
                    action.type === 'rename'
                      ? previous.playlists.map(playlist =>
                          playlist.id === action.id
                            ? { ...playlist, name }
                            : playlist
                        )
                      : previous.playlists.filter(
                          playlist => playlist.id !== action.id
                        ),
                  playlistAction: null,
                  playlistSaving: false,
                }))
              })
            }}
          >
            {state.playlistAction?.type === 'rename' && (
              <Field>
                <FieldLabel htmlFor='rename-playlist-name'>Name</FieldLabel>
                <Input
                  disabled={state.playlistSaving}
                  id='rename-playlist-name'
                  name='name'
                  defaultValue={state.playlistAction.name}
                  autoComplete='off'
                  required
                  pattern='.*\S.*'
                />
              </Field>
            )}
            <DialogFooter>
              <Button
                disabled={state.playlistSaving}
                className='w-full'
                type='submit'
                variant={
                  state.playlistAction?.type === 'delete'
                    ? 'destructive'
                    : 'default'
                }
              >
                {state.playlistSaving
                  ? state.playlistAction?.type === 'rename'
                    ? 'Saving…'
                    : 'Deleting…'
                  : state.playlistAction?.type === 'rename'
                    ? 'Save'
                    : 'Delete'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SidebarInset>
        <header className='flex items-center justify-between border-b p-2 md:hidden'>
          <SidebarTrigger aria-label='Open playlists' />
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              setState(previous => ({ ...previous, queueMobileOpen: true }))
            }
          >
            <SidebarIcon />
          </Button>
        </header>
        {children}
      </SidebarInset>
      {isMobile ? (
        <Sheet
          open={state.queueMobileOpen}
          onOpenChange={queueMobileOpen =>
            setState(previous => ({ ...previous, queueMobileOpen }))
          }
        >
          <SheetContent
            side='right'
            className='w-72 bg-sidebar p-2 [&>button]:hidden'
          >
            <SheetHeader className='sr-only'>
              <SheetTitle>Queue</SheetTitle>
              <SheetDescription>Upcoming tracks.</SheetDescription>
            </SheetHeader>
            {queueHeader}
          </SheetContent>
        </Sheet>
      ) : (
        <div
          className='group peer hidden md:block'
          data-side='right'
          data-variant='inset'
          data-state={state.queueOpen ? 'expanded' : 'collapsed'}
          data-collapsible={state.queueOpen ? '' : 'offcanvas'}
        >
          <div className='w-(--sidebar-width) transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0' />
          <Sidebar
            collapsible='none'
            side='right'
            aria-label='Queue'
            className='fixed inset-y-0 right-0 z-10 h-svh p-2 transition-[right] duration-200 ease-linear group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]'
          >
            {queueHeader}
            <SidebarRail
              onClick={() =>
                setState(previous => ({
                  ...previous,
                  queueOpen: !previous.queueOpen,
                }))
              }
              aria-label='Toggle queue'
              title='Toggle queue (Ctrl+M)'
              aria-keyshortcuts='Control+m'
              className='group-data-[side=right]:-left-2 after:inset-y-2 after:w-4 after:-translate-x-full after:rounded-r-xl after:border-y-2 after:border-r-2 after:border-transparent group-data-[collapsible=offcanvas]:after:start-0 hover:after:border-sidebar-border hover:after:bg-transparent'
            />
          </Sidebar>
        </div>
      )}
    </>
  )
}
