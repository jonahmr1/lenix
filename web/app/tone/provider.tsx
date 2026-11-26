'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/supabase/client'
import { toast } from 'sonner'
import { z } from 'zod'
import { storage } from '@lenix/lenix'
import type { SpotifyImportResult } from '@/lib/tone/spotify-actions'
import type { YouTubePlayer } from 'react-youtube'
import type { PriorityTier } from '@/lib/tone/priority-queue'
import type { SearchTrack } from '@/lib/tone/search-actions'

const track = z.object({ id: z.string(), title: z.string(), channel: z.string(), duration: z.string() })
const sessionSchema = z.object({
  currentTrack: track.nullable(), queue: z.array(track), nextQueue: z.array(track),
  queueIndex: z.int(), queuePlaylistId: z.string().nullable(),
  repeatTrack: z.boolean(), repeatQueue: z.boolean(),
})
const playbackSchema = z.object({
  id: z.string().nullable(), time: z.number().nonnegative(), duration: z.number().nonnegative(),
  volume: z.number().min(0).max(100), muted: z.boolean(), rate: z.number().positive(),
})

interface AppState {
  trackTiers: Record<string, PriorityTier>
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
  nextQueue: SearchTrack[]
  queue: SearchTrack[]
  queueIndex: number
  queuePlaylistId: string | null
  repeatQueue: boolean
  repeatTrack: boolean
  searchQuery: string
  searchResults: SearchTrack[] | null
  searchLoading: boolean
  autoFitPending: boolean
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
  pocketMode: "locked" | "unlock" | null
  playerExpanded: boolean
  queueMobileOpen: boolean
}

const AppContext = createContext<{
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
} | null>(null)

export function AppProvider({
  children,
  userId,
  cloudSession,
  playlists,
  trackTiers,
  spotifyPlaylistUrl,
}: {
  children: ReactNode
  cloudSession: unknown
  userId: string
  playlists: AppState['playlists']
  trackTiers: AppState['trackTiers']
  spotifyPlaylistUrl: string
}) {
  const key = `tone.player.${userId}`
  const initialCloud = useRef(cloudSession).current
  const pending = useRef<(() => void) | null>(null)
  const [state, setState] = useState<AppState>({
    trackTiers,
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
    nextQueue: [],
    queueIndex: -1,
    queuePlaylistId: null,
    repeatQueue: false,
    repeatTrack: false,
    searchQuery: '',
    searchResults: null,
    searchLoading: false,
    autoFitPending: false,
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
    pocketMode: null,
    playerExpanded: false,
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
    let session: z.infer<typeof sessionSchema> | undefined, playback: z.infer<typeof playbackSchema> | undefined
    try {
      session = sessionSchema.safeParse(JSON.parse(localStorage.getItem(key) ?? 'null')).data
      playback = playbackSchema.safeParse(JSON.parse(localStorage.getItem(key + '.playback') ?? 'null')).data
    } catch {}
    const remote = sessionSchema.extend({time: z.number(), duration: z.number()}).safeParse(initialCloud).data
    if (initialCloud === undefined) toast.error('Couldn’t load your synced player session.')
    const saved = playback
    const position = remote ?? (saved?.id === session?.currentTrack?.id ? saved : undefined)
    setState(previous => ({
      ...previous,
      ...(remote ?? session),
      playback: { ...previous.playback, volume: saved?.volume ?? 100, muted: saved?.muted ?? false, rate: saved?.rate ?? 1, time: position?.time ?? 0, duration: position?.duration ?? 0 },
      playlistsOpen,
      queueOpen,
      sidebarsRestored: true,
    }))
  }, [key, initialCloud])

  const {currentTrack, queue, nextQueue, queueIndex, queuePlaylistId, repeatTrack, repeatQueue, sidebarsRestored} = state
  useEffect(() => {
    if (!sidebarsRestored) return
    try {
      localStorage.setItem(key, JSON.stringify({currentTrack, queue, nextQueue, queueIndex, queuePlaylistId, repeatTrack, repeatQueue}))
    } catch {}
  }, [key, sidebarsRestored, currentTrack, queue, nextQueue, queueIndex, queuePlaylistId, repeatTrack, repeatQueue])

  const {time, duration, volume, muted, rate} = state.playback
  const lastSnapshot = useRef('')
  const lastWrite = useRef(0)
  const reportedError = useRef(false)
  useEffect(() => {
    if (!sidebarsRestored || initialCloud === undefined || !currentTrack) return
    const session = {currentTrack, queue, nextQueue, queueIndex, queuePlaylistId, repeatQueue, repeatTrack, time, duration}
    const signature = JSON.stringify(session)
    if (signature === lastSnapshot.current) return
    const first = !lastSnapshot.current
    lastSnapshot.current = signature
    if (first && (initialCloud || !currentTrack)) return
    const saved_at = new Date().toISOString()
    const save = () => {
      pending.current = null
      lastWrite.current = Date.now()
      void createClient().from('player').upsert({ id: userId, video_id: currentTrack.id, time: Math.floor(time), playing: state.playback.playing, session: JSON.parse(signature), saved_at }).then(({error}) => {
        if (error && !reportedError.current) toast.error('Couldn’t sync your player session.')
        reportedError.current = Boolean(error)
      })
    }
    pending.current = save
    const timer = window.setTimeout(save, state.playback.playing ? Math.max(0, 5000 - (Date.now() - lastWrite.current)) : 0)
    return () => window.clearTimeout(timer)
  }, [sidebarsRestored, initialCloud, userId, currentTrack, queue, nextQueue, queueIndex, queuePlaylistId, repeatQueue, repeatTrack, time, duration, state.playback.playing])

  useEffect(() => {
    const flush = () => pending.current?.()
    const hidden = () => { if (document.visibilityState === 'hidden') flush() }
    document.addEventListener('visibilitychange', hidden)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', hidden)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [])
  useEffect(() => {
    if (!sidebarsRestored) return
    const save = () => {
      try {
        const live = state.player as unknown as {getVideoData(): {video_id?: string}, getPlayerState(): number, getCurrentTime(): number} | null
        localStorage.setItem(key + '.playback', JSON.stringify({id: currentTrack?.id ?? null, time: live && live.getVideoData()?.video_id === currentTrack?.id && live.getPlayerState() !== 5 ? live.getCurrentTime() : time, duration, volume, muted, rate}))
      } catch {}
    }
    save()
    window.addEventListener('pagehide', save)
    return () => window.removeEventListener('pagehide', save)
  }, [key, sidebarsRestored, currentTrack, state.player, time, duration, volume, muted, rate])

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
