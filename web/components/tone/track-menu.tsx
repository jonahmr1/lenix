'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { normalizeTiers } from '@/lib/tone/priority-queue'
import { setTrackTier } from '@/lib/tone/tier-actions'
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import { SparkleIcon, PlusIcon, MinusIcon } from '@phosphor-icons/react'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from '@/components/ui/context-menu'
import { useApp } from '@/app/tone/provider'
import { AddToPlaylistMenu } from './add-to-playlist-menu'
import { autoFitTrack } from '@/lib/tone/autofit-actions'
import type { SearchTrack } from '@/lib/tone/search-actions'

export function TrackMenu({
  track,
  children,
  playlistId,
  dropdown = false,
}: {
  track: SearchTrack | null
  children: ReactNode
  playlistId?: string | null
  dropdown?: boolean
}) {
  const Menu = dropdown ? DropdownMenu : ContextMenu
  const MenuTrigger = dropdown ? DropdownMenuTrigger : ContextMenuTrigger
  const MenuContent = dropdown ? DropdownMenuContent : ContextMenuContent
  const MenuItem = dropdown ? DropdownMenuItem : ContextMenuItem
  const MenuSeparator = dropdown ? DropdownMenuSeparator : ContextMenuSeparator
  const MenuGroup = dropdown ? DropdownMenuGroup : ContextMenuGroup
  const MenuSub = dropdown ? DropdownMenuSub : ContextMenuSub
  const MenuSubTrigger = dropdown
    ? DropdownMenuSubTrigger
    : ContextMenuSubTrigger
  const MenuSubContent = dropdown
    ? DropdownMenuSubContent
    : ContextMenuSubContent
  const MenuRadioGroup = dropdown
    ? DropdownMenuRadioGroup
    : ContextMenuRadioGroup
  const MenuRadioItem = dropdown ? DropdownMenuRadioItem : ContextMenuRadioItem
  const { state, setState } = useApp()
  const playlist = state.playlists.find(
    item => item.id === playlistId && track && item.tracks.includes(track.id)
  )
  const tiers = normalizeTiers(
    playlist?.tracks ?? [],
    Object.fromEntries(
      (playlist?.tracks ?? []).map(id => [
        id,
        state.trackTiers[`${playlistId}:${id}`] ?? 1,
      ])
    )
  )
  const tierCount = Math.max(0, ...Object.values(tiers))
  async function changeTier(id: string, target: number | 'ascend' | 'descend') {
    try {
      const result = await setTrackTier(playlist!.id, id, target)
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      setState(previous => ({
        ...previous,
        trackTiers: {
          ...Object.fromEntries(
            Object.entries(previous.trackTiers).filter(
              ([key]) => !key.startsWith(`${playlist!.id}:`)
            )
          ),
          ...Object.fromEntries(
            Object.entries(result.tiers).map(([id, tier]) => [
              `${playlist!.id}:${id}`,
              tier,
            ])
          ),
        },
      }))
    } catch {
      toast.error('Couldn’t save the tier. Please try again.')
    }
  }
  if (!track) return children
  return (
    <Menu>
      <MenuTrigger asChild>{children}</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem
            disabled={state.autoFitPending}
            onSelect={async () => {
              if (state.autoFitPending) return
              setState(previous => ({
                ...previous,
                autoFitPending: true,
              }))
              const notification = toast.loading('Finding a playlist…')
              try {
                const result = await autoFitTrack(track.id)
                if ('error' in result) throw new Error(result.error)
                setState(previous => ({
                  ...previous,
                  playlists: previous.playlists.some(
                    p => p.id === result.playlist.id
                  )
                    ? previous.playlists.map(p =>
                        p.id === result.playlist.id ? result.playlist : p
                      )
                    : [...previous.playlists, result.playlist],
                }))
                toast.success(
                  result.created
                    ? `Created “${result.playlist.name}” and added track.`
                    : `Added to “${result.playlist.name}”.`,
                  { id: notification }
                )
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Couldn’t auto-fit this track. Please try again.',
                  { id: notification }
                )
              } finally {
                setState(previous => ({
                  ...previous,
                  autoFitPending: false,
                }))
              }
            }}
          >
            <SparkleIcon />
            <span>Auto-fit</span>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        {playlist && (
          <>
            <MenuSub>
              <MenuSubTrigger>Tier</MenuSubTrigger>
              <MenuSubContent>
                <MenuRadioGroup
                  value={String(tiers[track.id])}
                  onValueChange={value => changeTier(track.id, Number(value))}
                >
                  <MenuItem
                    onSelect={() => changeTier(track.id, 'ascend')}
                    className='justify-center'
                  >
                    <PlusIcon />
                  </MenuItem>
                  {Array.from({ length: tierCount }, (_, index) => (
                    <MenuRadioItem key={index + 1} value={String(index + 1)}>
                      Tier {index + 1}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
                {(tiers[track.id] < tierCount ||
                  Object.values(tiers).filter(tier => tier === tierCount)
                    .length > 1) && (
                  <MenuItem
                    onSelect={() => changeTier(track.id, 'descend')}
                    className='justify-center'
                  >
                    <MinusIcon />
                  </MenuItem>
                )}
              </MenuSubContent>
            </MenuSub>
            <MenuItem
              variant='destructive'
              onSelect={async () => {
                const saving = toast.loading('Removing track…')
                try {
                  const result = await setTrackInPlaylist(
                    playlist.id,
                    track.id,
                    false
                  )
                  if ('error' in result) throw new Error(result.error)
                  setState(previous => ({
                    ...previous,
                    playlists: previous.playlists.map(item =>
                      item.id === playlist.id
                        ? {
                            ...item,
                            tracks: item.tracks.filter(id => id !== track.id),
                          }
                        : item
                    ),
                  }))
                  toast.success(`Removed from ${result.playlistName}`, {
                    id: saving,
                  })
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : 'Couldn’t remove this track. Please try again.',
                    { id: saving }
                  )
                }
              }}
            >
              Remove from playlist
            </MenuItem>
          </>
        )}
        <MenuSeparator />
        <AddToPlaylistMenu track={track} dropdown={dropdown} />
      </MenuContent>
    </Menu>
  )
}
