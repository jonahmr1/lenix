'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { notFound, useParams } from 'next/navigation'
import { useApp } from '../../provider'

export default function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>()
  const { state } = useApp()
  const playlist = state.playlists.find(playlist => playlist.id === playlistId)
  if (!playlist) notFound()

  return (
    <Breadcrumb className='not-typeset p-6'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/tone'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{playlist.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
