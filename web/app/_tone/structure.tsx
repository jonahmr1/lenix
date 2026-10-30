'use client'

import { Player } from '@/components/tone.old/player'
import { Search } from '@/components/tone.old/search'
import { AppSidebar } from '@/components/tone.old/sidebard'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { useStates } from '@/hooks/useStates.old'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const Breadcrumbs = () => {
	const { playlistId } = useParams<{ playlistId?: string }>()
	const { states } = useStates()
	const playlist = states.playlists?.find(p => p.id === playlistId)

	return (
		<Breadcrumb>
			<BreadcrumbList className="list-none">
				<BreadcrumbItem>
					{playlistId ? (
						<BreadcrumbLink asChild>
							<Link href="/tone">Home</Link>
						</BreadcrumbLink>
					) : (
						<BreadcrumbPage>Home</BreadcrumbPage>
					)}
				</BreadcrumbItem>

				{playlistId && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{playlist?.label ??
									(states.playlists ? 'Playlist not found' : 'Loading…')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

export default function Structure({ children }: { children: React.ReactNode }) {
	const { loading } = useStates()

	if (loading) return children

	return (
		<SidebarProvider className="h-screen">
			<AppSidebar />
			<SidebarInset className="relative overflow-hidden">
				<div className="flex size-full flex-col gap-[2vh] *:min-h-0">
					<div className="z-1 flex flex-1 items-start px-[1vw] pt-[2vh] portrait:flex-col">
						<div className="flex shrink-0">
							<SidebarTrigger />
							<Breadcrumbs />
						</div>
						<div className="flex w-full justify-center">
							<Search />
						</div>
					</div>
					<div className="size-full flex-7">{children}</div>
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}
