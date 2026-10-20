'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '../ui/sidebar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase.client'
import { Skeleton } from '@/components/ui/skeleton'
import { Thumbnail } from '@/components/thumbnail'
import { useStates } from '@/hooks/useStates'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import dayjs from 'dayjs'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import {
  CaretUpDownIcon,
  DotsThreeIcon,
  EnvelopeSimpleIcon,
  InfoIcon,
  PlaylistIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui/item'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Lead } from '../typography'
import { Fragment } from 'react/jsx-runtime'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Spinner } from '../ui/spinner'
import { useEffect, useRef, useState } from 'react'
import {
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  Empty,
} from '../ui/empty'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import Link from 'next/link'
import { useParams } from 'next/navigation'

dayjs.extend(relativeTime)
const format = (value: string | undefined, accurate?: true) =>
  dayjs(value).format(`${accurate ? 'H:mm ' : ''}MMMM D, YYYY`)

export const AppSidebar = () => {
  const { states, setStates } = useStates()
  const playlistInput = useRef<HTMLInputElement>(null)
  const renamePlaylistInput = useRef<HTMLInputElement>(null)
  const { playlistId } = useParams<{ playlistId: string }>()

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const { error, data } = await createClient().from('playlists').select('*')

      if (error) {
        toast.error('Error', {
          description: JSON.stringify(error),
        })
        return
      }

      setStates(prev => ({ ...prev, playlists: data }))
    })

    return () => clearTimeout(timeout)
  }, [states.user])

  return (
    <Fragment>
      <Sidebar variant="inset">
        <SidebarHeader className="flex-row items-center justify-between">
          <Lead>Playlists</Lead>
          <Dialog
            open={states.createPlaylistDialog}
            onOpenChange={createPlaylistDialog =>
              setStates(prev => ({ ...prev, createPlaylistDialog }))
            }
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <PlusIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new playlist</DialogTitle>
                <DialogDescription className="flex flex-col gap-[1vh]">
                  <Label htmlFor="id">Playlist name</Label>
                  <Input
                    id="id"
                    defaultValue="My Playlist"
                    ref={playlistInput}
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className="w-full"
                  disabled={states.creatingPlaylist}
                  onClick={async () => {
                    const label = playlistInput.current?.value
                    if (!label || label.trim().length < 3) {
                      toast.warning(
                        'Playlist name must be at least 3 characters long.'
                      )
                      return
                    }
                    if (!states.user) {
                      toast.warning(
                        'Creating playlists are available only for the registered users atm.'
                      )
                      return
                    }
                    setStates(prev => ({ ...prev, creatingPlaylist: true }))
                    const { error, data } = await createClient()
                      .from('playlists')
                      .insert({ label, tracks: [] })
                      .select('*')

                    setStates(prev => ({
                      ...prev,
                      createPlaylistDialog: false,
                    }))
                    setStates(prev => ({ ...prev, creatingPlaylist: false }))
                    if (error) {
                      toast.error('Error', {
                        description: JSON.stringify(error),
                      })
                      return
                    }
                    toast.success('Playlist Created.')
                    setStates(prev => ({
                      ...prev,
                      playlists: [...(prev.playlists ?? []), ...data],
                    }))
                  }}
                >
                  {states.creatingPlaylist ? <Spinner /> : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarHeader>
        <SidebarContent>
          {states.playlists ? (
            states.playlists.length ? (
              <SidebarGroup>
                {states.playlists.map(playlist => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton
                      variant="outline"
                      isActive={playlistId === playlist.id}
                      asChild
                    >
                      <Link
                        className="no-underline"
                        href={`/tone/${playlist.id}`}
                      >
                        {playlist.label}
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <DotsThreeIcon />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                              >
                                Rename
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rename playlist</DialogTitle>
                                <DialogDescription className="flex flex-col gap-[1vh]">
                                  <Label htmlFor="id">Playlist name</Label>
                                  <Input
                                    id="id"
                                    defaultValue={playlist.label}
                                    ref={renamePlaylistInput}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  className="w-full"
                                  disabled={states.renamingPlaylist}
                                  onClick={async () => {
                                    const label =
                                      renamePlaylistInput.current?.value
                                    if (!label || label.trim().length < 3) {
                                      toast.warning(
                                        'Playlist name must be at least 3 characters long.'
                                      )
                                      return
                                    }

                                    setStates(prev => ({
                                      ...prev,
                                      renamingPlaylist: true,
                                    }))
                                    const { error, data } = await createClient()
                                      .from('playlists')
                                      .update({ label })
                                      .eq('id', playlist.id)
                                      .select('*')
                                      .single()

                                    setStates(prev => ({
                                      ...prev,
                                      renamingPlaylist: false,
                                    }))
                                    if (error) {
                                      toast.error('Error', {
                                        description: JSON.stringify(error),
                                      })
                                      return
                                    }
                                    toast.success('Playlist renamed.')
                                    setStates(prev => ({
                                      ...prev,
                                      playlists: (prev.playlists ?? []).map(
                                        p => (data.id === p.id ? data : p)
                                      ),
                                    }))
                                  }}
                                >
                                  {states.renamingPlaylist ? (
                                    <Spinner />
                                  ) : (
                                    'Rename'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={e => e.preventDefault()}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure you want to delete{' '}
                                  <b>{playlist.label}</b> playlist?
                                </DialogTitle>
                                <DialogDescription>
                                  This action can not be undone
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  disabled={states.deletingPlaylist}
                                  onClick={async () => {
                                    setStates(prev => ({
                                      ...prev,
                                      deletingPlaylist: true,
                                    }))
                                    const { error, data } = await createClient()
                                      .from('playlists')
                                      .delete()
                                      .eq('id', playlist.id)
                                      .select('*')
                                      .single()

                                    setStates(prev => ({
                                      ...prev,
                                      deletingPlaylist: false,
                                    }))
                                    if (error) {
                                      toast.error('Error', {
                                        description: JSON.stringify(error),
                                      })
                                      return
                                    }
                                    toast.success('Playlist deleted.')
                                    setStates(prev => ({
                                      ...prev,
                                      playlists: (prev.playlists ?? []).filter(
                                        p => p.id !== data.id
                                      ),
                                    }))
                                  }}
                                >
                                  {states.deletingPlaylist ? (
                                    <Spinner />
                                  ) : (
                                    'Delete'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty className="px-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <PlaylistIcon />
                    </EmptyMedia>
                    <EmptyTitle>No playlist</EmptyTitle>
                    <EmptyDescription>
                      You haven't created any playlist yet. Get started by
                      creating your first playlist
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      onClick={() =>
                        setStates(prev => ({
                          ...prev,
                          createPlaylistDialog: true,
                        }))
                      }
                    >
                      Create playlist
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          )}
        </SidebarContent>
        <SidebarFooter>
          {states.user === undefined ? (
            <Skeleton className="h-[5vh] w-[5vh] rounded-full" />
          ) : states.user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="justify-between py-[2.5vh]"
                >
                  <div className="flex items-center gap-[0.5vw]">
                    <Thumbnail
                      size="sm"
                      src={states.user.user_metadata.avatar_url}
                    />
                    <p className="text-foreground">
                      {states.user.user_metadata.name}
                    </p>
                  </div>
                  <CaretUpDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Item variant="muted">
                  <ItemMedia>
                    <Thumbnail
                      size="sm"
                      src={states.user.user_metadata.avatar_url}
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{states.user.user_metadata.full_name}</ItemTitle>
                    <ItemDescription>
                      <span className="font-bold">User Since: </span>
                      <span>{format(states.user.created_at)}</span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <EnvelopeSimpleIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Email</ItemTitle>
                    <ItemDescription>{states.user.email}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon />
                      </HoverCardTrigger>
                      <HoverCardContent side="right">
                        <p>
                          Registered using{' '}
                          <b>{states.user.app_metadata.provider}</b>
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </ItemActions>
                </Item>
                {states.user.last_sign_in_at && (
                  <p>
                    <span className="font-bold">Last sign in: </span>
                    <span>
                      {dayjs(states.user.last_sign_in_at).fromNow()} (
                      {format(states.user.last_sign_in_at, true)})
                    </span>
                  </p>
                )}
                <Button
                  variant="destructive"
                  onClick={async () => {
                    toast.promise(
                      async () => {
                        const { error } = await createClient().auth.signOut({
                          scope: 'local',
                        })
                        if (error) throw error

                        setStates(prev => ({ ...prev, user: null }))
                      },
                      {
                        loading: 'Signing out...',
                        error: error => error,
                        success: 'Signed out',
                      }
                    )
                  }}
                >
                  Sign out
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              onClick={() => {
                createClient().auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                })
              }}
            >
              Continue with Goggle
            </Button>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </Fragment>
  )
}
