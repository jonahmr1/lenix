'use client'

import type { ReactNode } from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppProvider } from './provider'

export default function ToneLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
			<SidebarProvider>
				<Sidebar variant='inset'>
					<SidebarHeader>Playlists</SidebarHeader>
					<SidebarRail className='after:inset-y-2 after:w-4 after:rounded-l-xl after:border-y-2 after:border-l-2 after:border-transparent hover:after:border-sidebar-border hover:after:bg-transparent' />
				</Sidebar>
				<SidebarInset>
					{children}
				</SidebarInset>
				<Sidebar variant='inset' side='right'>
					<SidebarHeader>Queue</SidebarHeader>
					<SidebarRail className='after:inset-y-2 after:w-4 after:-translate-x-full after:rounded-r-xl after:border-y-2 after:border-r-2 after:border-transparent hover:after:border-sidebar-border hover:after:bg-transparent group-data-[side=right]:-left-2 group-data-[collapsible=offcanvas]:after:start-0' />
				</Sidebar>
			</SidebarProvider>
    </AppProvider>
  )
}
