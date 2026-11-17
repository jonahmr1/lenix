'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import type { SearchTrack } from '@/lib/tone/search-actions'

type AppState = {
  searchQuery: string
  searchResults: SearchTrack[] | null
  searchLoading: boolean
  searchMoreLoading: boolean
  searchActiveQuery: string
  searchNextPageToken: string | null
  playlistAction: { type: 'rename' | 'delete'; id: string; name: string } | null
  newPlaylistOpen: boolean
  playlistSaving: boolean
  playlists: { id: string; name: string }[]
  playlistsOpen: boolean
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
}: {
  children: ReactNode
  playlists: AppState['playlists']
}) {
  const [state, setState] = useState<AppState>({
    searchQuery: '',
    searchResults: null,
    searchLoading: false,
    searchMoreLoading: false,
    searchActiveQuery: '',
    searchNextPageToken: null,
    playlistAction: null,
    newPlaylistOpen: false,
    playlists,
    playlistSaving: false,
    playlistsOpen: true,
    queueOpen: true,
    queueMobileOpen: false,
  })

  return (
    <AppContext.Provider value={{ state, setState }}>
      <SidebarProvider
        className='min-h-dvh'
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
