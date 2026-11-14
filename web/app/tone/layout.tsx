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
					<SidebarRail />
				</Sidebar>
				<SidebarInset>
					{children}
				</SidebarInset>
				<Sidebar variant='inset' side='right'>
					<SidebarHeader>Queue</SidebarHeader>
					<SidebarRail />
				</Sidebar>
			</SidebarProvider>
    </AppProvider>
  )
}