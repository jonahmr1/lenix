'use client'

import { notFound, useParams } from 'next/navigation'
import { useApp } from '../../provider'

export default function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>()
  const { state } = useApp()
  const playlist = state.playlists.find(playlist => playlist.id === playlistId)
  if (!playlist) notFound()

  return <h1 className='p-6 text-2xl font-semibold'>{playlist.name}</h1>
}
