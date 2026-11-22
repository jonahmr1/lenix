'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { storage } from '@lenix/lenix'
import type { SpotifyImportResult } from '@/lib/tone/spotify-actions'
import type { YouTubePlayer } from 'react-youtube'
import type { SearchTrack } from '@/lib/tone/search-actions'

type AppState = {
  player: YouTubePlayer | null
  playback: {
    playing: boolean
    time: number
    duration: number
    volume: number
    muted: boolean
    rate: number
    rates: number[]
  }
  currentTrack: SearchTrack | null
  queue: SearchTrack[]
  queueIndex: number
  queuePlaylistId: string | null
  repeatQueue: boolean
  repeatTrack: boolean
  searchQuery: string
  searchResults: SearchTrack[] | null
  searchLoading: boolean
  searchMoreLoading: boolean
  searchActiveQuery: string
  searchNextPageToken: string | null
  playlistAction: { type: 'rename' | 'delete'; id: string; name: string } | null
  newPlaylistOpen: boolean
  spotifyImportOpen: boolean
  spotifyImportResult: SpotifyImportResult | null
  spotifyImportProgress: {
    checked: number
    total: number
    matched: number
  } | null
  spotifyImportStep: number
  spotifyPlaylistUrl: string
  playlistSaving: boolean
  playlists: { id: string; name: string; tracks: string[] }[]
  playlistsOpen: boolean
  sidebarsRestored: boolean
  queueOpen: boolean
  queueMobileOpen: boolean
}

const AppContext = createContext<{
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
} | null>(null)

export function AppProvider({
  children,
  playlists,
  spotifyPlaylistUrl,
}: {
  children: ReactNode
  playlists: AppState['playlists']
  spotifyPlaylistUrl: string
}) {
  const [state, setState] = useState<AppState>({
      player: null,
    playback: {
      playing: false,
      time: 0,
      duration: 0,
      volume: 100,
      muted: false,
      rate: 1,
      rates: [1],
    },
    currentTrack: null,
    queue: [],
    queueIndex: -1,
    queuePlaylistId: null,
    repeatQueue: false,
    repeatTrack: false,
    searchQuery: '',
    searchResults: null,
    searchLoading: false,
    searchMoreLoading: false,
    searchActiveQuery: '',
    searchNextPageToken: null,
    playlistAction: null,
    newPlaylistOpen: false,
    spotifyImportOpen: false,
    spotifyPlaylistUrl,
    spotifyImportResult: null,
    spotifyImportStep: 0,
    spotifyImportProgress: null,
    playlists,
    playlistSaving: false,
    playlistsOpen: true,
    sidebarsRestored: false,
    queueOpen: true,
    queueMobileOpen: false,
  })

  useEffect(() => {
    let playlistsOpen = true
    let queueOpen = true
    try {
      playlistsOpen =
        storage.get<Record<string, boolean>, string>('tone.playlistsOpen') !==
        'false'
      queueOpen =
        storage.get<Record<string, boolean>, string>('tone.queueOpen') !==
        'false'
    } catch {}
    setState(previous => ({
      ...previous,
      playlistsOpen,
      queueOpen,
      sidebarsRestored: true,
    }))
  }, [])

  useEffect(() => {
    if (!state.sidebarsRestored) return
    try {
      storage.set<Record<string, boolean>, string>(
        'tone.playlistsOpen',
        state.playlistsOpen
      )
      storage.set<Record<string, boolean>, string>(
        'tone.queueOpen',
        state.queueOpen
      )
    } catch {}
  }, [state.sidebarsRestored, state.playlistsOpen, state.queueOpen])

  if (!state.sidebarsRestored) return null

  return (
    <AppContext.Provider value={{ state, setState }}>
      <SidebarProvider
        className='h-dvh min-h-0 flex-col'
        keyboardShortcut={null}
        open={state.playlistsOpen}
        onOpenChange={playlistsOpen =>
          setState(previous => ({ ...previous, playlistsOpen }))
        }
      >
        {children}
      </SidebarProvider>
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
