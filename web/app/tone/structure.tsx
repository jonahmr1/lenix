'use client'

import { Player } from "@/components/tone/player"
import { Search } from "@/components/tone/search"
import { AppSidebar } from "@/components/tone/sidebard"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useStates } from "@/hooks/useStates"
import Link from "next/link"
import { useParams } from "next/navigation"

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

export default function Structure({
	children
}: {
	children: React.ReactNode
}) {
	const { loading } = useStates()

	if (loading) return children

	return (
		<SidebarProvider className='h-screen'>
			<AppSidebar />
			<SidebarInset className="relative overflow-hidden">
				<div className="size-full flex flex-col *:min-h-0">
					<div className='flex items-start pt-[2vh] px-[2vw]'>
						<div className="flex-1 flex items-end">
							<SidebarTrigger />
							<Breadcrumbs />
						</div>
						<div className="relative flex flex-2 w-full justify-center z-1">
							<Search />
						</div>
					</div>
					<div className="flex-5 size-full">
						{children}
					</div>
					<div className="flex-1" />
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}
