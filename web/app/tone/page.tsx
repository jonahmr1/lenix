'use client'

import { useEffect } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
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
			<KbdGroup className='p-1' aria-label='Control + M'>
				<Kbd>Ctrl</Kbd><Kbd>M</Kbd>
			</KbdGroup>
		</SidebarHeader>
	)

	return (
		<>
			<Sidebar variant='inset' aria-label='Playlists'>
				<SidebarHeader className='group/playlists-header flex-row items-center justify-between'>
					Playlists
					<div className='flex items-center gap-2'>
						<Dialog open={state.newPlaylistOpen} onOpenChange={newPlaylistOpen => setState(previous => ({ ...previous, newPlaylistOpen }))}>
							<DialogTrigger asChild>
								<Button variant='ghost' size='icon-xs' aria-label='Create playlist' className='opacity-0 group-hover/playlists-header:opacity-100 focus-visible:opacity-100'>
									<PlusIcon />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create a new playlist</DialogTitle>
								</DialogHeader>
								<form className='grid gap-4' onSubmit={event => {
									event.preventDefault()
									const form = event.currentTarget
									const name = String(new FormData(form).get('name') ?? '').trim()
									if (!name) return
									const playlist = { id: crypto.randomUUID(), name }
									setState(previous => ({ ...previous, playlists: [...previous.playlists, playlist], newPlaylistOpen: false }))
									form.reset()
								}}>
									<Field>
										<FieldLabel htmlFor='playlist-name'>Name</FieldLabel>
										<Input id='playlist-name' name='name' placeholder='e.g. Late night jazz' autoComplete='off' required pattern='.*\S.*' />
									</Field>
									<DialogFooter>
										<Button className='w-full' type='submit'>Create playlist</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
						<KbdGroup className='p-1' aria-label='Command or Control + B'>
							<Kbd>⌘/Ctrl</Kbd><Kbd>B</Kbd>
						</KbdGroup>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							{state.playlists.map(playlist => (
								<SidebarMenuItem key={playlist.id} className='truncate px-2 py-1.5' title={playlist.name}>
									{playlist.name}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
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
