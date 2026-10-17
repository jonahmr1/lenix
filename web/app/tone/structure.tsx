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
				<div className="size-full flex flex-col *:min-h-0 gap-[2vh]">
					<div className='flex portrait:flex-col items-start pt-[2vh] px-[2vw]'>
						<div className="flex">
							<SidebarTrigger />
							<Breadcrumbs />
						</div>
						<div className="w-full flex justify-center">
							<Search />
						</div>
					</div>
					<div className="flex-5 size-full">
						{children}
					</div>
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}
