'use client'

import { useEffect } from 'react'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useApp } from './provider'

export default function TonePage() {
  const { state, setState } = useApp()
  const { isMobile } = useSidebar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'm' ||
        !event.ctrlKey ||
        event.metaKey || event.altKey || event.shiftKey || event.repeat ||
        (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))
      ) return

      event.preventDefault()
      const key = isMobile ? 'queueMobileOpen' : 'queueOpen'
      setState(previous => ({ ...previous, [key]: !previous[key] }))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, setState])

  const queueHeader = (
    <SidebarHeader className='flex-row items-center justify-between'>
      Queue
      <KbdGroup aria-label='Control + M'>
        <Kbd>Ctrl</Kbd><Kbd>M</Kbd>
      </KbdGroup>
    </SidebarHeader>
  )

  return (
		<>
			<Sidebar variant='inset' aria-label='Playlists'>
				<SidebarHeader className='flex-row items-center justify-between'>
					Playlists
					<KbdGroup aria-label='Command or Control + B'>
						<Kbd>⌘/Ctrl</Kbd><Kbd>B</Kbd>
					</KbdGroup>
				</SidebarHeader>
				<SidebarRail aria-label='Toggle playlists' title='Toggle playlists (⌘/Ctrl+B)' aria-keyshortcuts='Meta+b Control+b' className='after:inset-y-2 after:w-4 after:rounded-l-xl after:border-y-2 after:border-l-2 after:border-transparent hover:after:border-sidebar-border hover:after:bg-transparent' />
			</Sidebar>
			<SidebarInset>
				
			</SidebarInset>
			{isMobile ? (
				<Sheet open={state.queueMobileOpen} onOpenChange={queueMobileOpen => setState(previous => ({ ...previous, queueMobileOpen }))}>
					<SheetContent side='right' className='w-72 bg-sidebar p-2 [&>button]:hidden'>
						<SheetHeader className='sr-only'>
							<SheetTitle>Queue</SheetTitle>
							<SheetDescription>Upcoming tracks.</SheetDescription>
						</SheetHeader>
						{queueHeader}
					</SheetContent>
				</Sheet>
			) : (
				<div className='group peer hidden md:block' data-side='right' data-variant='inset' data-state={state.queueOpen ? 'expanded' : 'collapsed'} data-collapsible={state.queueOpen ? '' : 'offcanvas'}>
					<div className='w-(--sidebar-width) transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0' />
					<Sidebar collapsible='none' side='right' aria-label='Queue' className='fixed inset-y-0 right-0 z-10 h-svh p-2 transition-[right] duration-200 ease-linear group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]'>
						{queueHeader}
						<SidebarRail onClick={() => setState(previous => ({ ...previous, queueOpen: !previous.queueOpen }))} aria-label='Toggle queue' title='Toggle queue (Ctrl+M)' aria-keyshortcuts='Control+m' className='after:inset-y-2 after:w-4 after:-translate-x-full after:rounded-r-xl after:border-y-2 after:border-r-2 after:border-transparent hover:after:border-sidebar-border hover:after:bg-transparent group-data-[side=right]:-left-2 group-data-[collapsible=offcanvas]:after:start-0' />
					</Sidebar>
				</div>
			)}
		</>
	)
}
