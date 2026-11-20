'use client'

import { useApp } from '@/app/tone/provider'
import YouTube from 'react-youtube'
import { toast } from 'sonner'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
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
        onEnd={event => {
          const nextIndex = state.queueIndex + 1
          const nextTrack = state.queue[nextIndex]
          if (!nextTrack) return
          if (nextTrack.id === track.id)
            event.target.loadVideoById(nextTrack.id)
          setState(previous => ({
            ...previous,
            queueIndex: nextIndex,
            currentTrack: nextTrack,
          }))
        }}
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
      {track && (
        <div className='py-2 pr-2'>
          <p className='mb-2 text-xs font-medium'>Now playing</p>
          <div className='flex items-center gap-2 rounded-md bg-sidebar-accent p-2 text-xs'>
            <img
              src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
              alt=''
              width={28}
              height={28}
              className='size-7 shrink-0 rounded-md object-cover'
            />
            <div className='min-w-0'>
              <p className='truncate text-foreground' title={track.title}>
                {track.title}
              </p>
              <p
                className='truncate text-[11px]'
                title={track.channel}
              >
                {track.channel}
              </p>
            </div>
          </div>
        </div>
      )}
      {state.queueIndex + 1 < state.queue.length && (
        <p className='text-xs font-medium'>Up next</p>
      )}
      {state.queueIndex + 1 >= state.queue.length && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No tracks queued</EmptyTitle>
            <EmptyDescription>Play a playlist to start a queue.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      <ol aria-label='Queued tracks' className='space-y-1 px-0 py-2 pr-2'>
        {state.queue.slice(state.queueIndex + 1).map((track, index) => (
          <li key={track.id} className='flex items-center gap-2 py-1 text-xs'>
            <img
              src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
              alt=''
              width={28}
              height={28}
              className='size-7 shrink-0 rounded-md object-cover'
            />
            <div className='min-w-0'>
              <p className='truncate text-foreground' title={track.title}>
                {track.title}
              </p>
              <p
                className='truncate text-[11px] text-muted-foreground'
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
        <div className='-z-100'>
					{video}
				</div>
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
        {state.queueIndex + 1 < state.queue.length ? (
          <ScrollFade className='m-0'>{queue}</ScrollFade>
        ) : queue}
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
