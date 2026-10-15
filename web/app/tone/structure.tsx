'use client'
import { Player } from "@/components/tone/player"
import { Search } from "@/components/tone/search"
import { AppSidebar } from "@/components/tone/sidebard"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { StatesContext } from "./provider"
import { useContext } from "react"

export default function Structure({
	children
}: {
	children: React.ReactNode
}) {
	const context = useContext(StatesContext)

	if (!context) return children

	return (
		<SidebarProvider className='min-h-screen'>
			<AppSidebar />
			<SidebarInset className="relative overflow-hidden">
				<div className="size-full flex flex-col *:flex-1 *:min-h-0">
					<div className='flex items-start pt-[2vh] px-[2vw]'>
						<SidebarTrigger />
						<div className="flex w-full justify-center z-1">
							<Search />
						</div>
					</div>
					<div className="flex size-full flex-col items-center">
						{children}
					</div>
					<div></div>
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}