'use client'

import { useApp } from '@/app/tone/provider'
import YouTube from 'react-youtube'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import ScrollFade from '../scroll-fade'

export function QueueSidebar() {
  const { state, setState } = useApp()
  const { isMobile } = useSidebar()
  const track = state.currentTrack
  const video = track ? (
    <div
      inert
      className='mt-auto h-50 w-full shrink-0 overflow-hidden rounded-md bg-black'
    >
      <YouTube
        videoId={track.id}
        title={`Playing ${track.title}`}
        className='h-full w-full'
        iframeClassName='pointer-events-none block'
        opts={{
          width: '100%',
          height: '200',
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            controls: 0,
            disablekb: 1,
          },
        }}
        onReady={async event => {
          const iframe = await event.target.getIframe()
          iframe.tabIndex = -1
          setState(previous => ({ ...previous, player: event.target }))
        }}
        onStateChange={event =>
          setState(previous => ({
            ...previous,
            playback: { ...previous.playback, playing: event.data === 1 },
          }))
        }
        onError={() =>
          toast.error('YouTube couldn’t play this track. Try another track.')
        }
      />
    </div>
  ) : null
  const queueHeader = (
    <SidebarHeader className='flex-row items-center justify-between'>
      Queue
    </SidebarHeader>
  )
  const queue = (
    <SidebarContent>
      <ol aria-label='Queued tracks' className='space-y-1 px-0 pr-2 py-2'>
        {state.queue.map((track, index) => (
          <li key={track.id} className='flex items-center gap-3 py-2 text-sm'>
            <span className='text-muted-foreground tabular-nums'>
              {index + 1}
            </span>
            <img
              src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
              alt=''
              width={32}
              height={32}
              className='size-8 shrink-0 rounded-md object-cover'
            />
            <div className='min-w-0'>
              <p className='truncate' title={track.title}>
                {track.title}
              </p>
              <p
                className='truncate text-xs text-muted-foreground'
                title={track.channel}
              >
                {track.channel}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SidebarContent>
  )

  return isMobile ? (
    <Sheet
      open={state.queueMobileOpen}
      onOpenChange={queueMobileOpen =>
        setState(previous => ({ ...previous, queueMobileOpen }))
      }
    >
      <SheetContent
        side='right'
        className='w-72 bg-sidebar p-2 [&>button]:hidden'
      >
        <SheetHeader className='sr-only'>
          <SheetTitle>Queue</SheetTitle>
          <SheetDescription>Upcoming tracks.</SheetDescription>
        </SheetHeader>
        {queueHeader}
        {queue}
        {video}
      </SheetContent>
    </Sheet>
  ) : (
    <div
      className='group peer hidden md:block'
      data-side='right'
      data-variant='inset'
      data-state={state.queueOpen ? 'expanded' : 'collapsed'}
      data-collapsible={state.queueOpen ? '' : 'offcanvas'}
    >
      <div className='w-(--sidebar-width) transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0' />
      <Sidebar
        collapsible='none'
        side='right'
        aria-label='Queue'
        className='fixed inset-y-0 right-0 z-10 h-[calc(100dvh-5rem)] p-2 transition-[right] duration-200 ease-linear group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]'
      >
        {queueHeader}
        <ScrollFade className='m-0'>
					{queue}
				</ScrollFade>
				<br />
        {video}
        <SidebarRail
          onClick={() =>
            setState(previous => ({
              ...previous,
              queueOpen: !previous.queueOpen,
            }))
          }
          aria-label='Toggle queue'
          title='Toggle queue (Ctrl+M)'
          aria-keyshortcuts='Control+m'
          className='group-data-[side=right]:-left-2 after:inset-y-2 after:w-4 after:-translate-x-full after:rounded-r-xl after:border-y-2 after:border-r-2 after:border-transparent group-data-[collapsible=offcanvas]:after:start-0 hover:after:border-sidebar-border hover:after:bg-transparent'
        />
      </Sidebar>
    </div>
  )
}
