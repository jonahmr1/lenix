'use client'
import { QueueIcon, SidebarIcon } from '@phosphor-icons/react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

function Queue() {
  return (
    <div className="flex justify-evenly space-y-3 p-5 text-sm text-muted-foreground">
      <QueueIcon className="size-6" aria-hidden="true" />
      <p>Nothing queued yet.</p>
    </div>
  )
}

export function QueueSidebar() {
  return (
    <Sidebar side="right" className="absolute h-full" aria-label="Queue">
      <SidebarHeader className="not-typeset flex-row items-center p-4">
        <SidebarTrigger className="size-11" aria-label="Toggle queue" />
        <h2 className="text-sm font-medium">Queue</h2>
      </SidebarHeader>
      <SidebarContent className="not-typeset">
        <Queue />
      </SidebarContent>
    </Sidebar>
  )
}

export function QueueTrigger() {
  const { open, openMobile, isMobile } = useSidebar()
  if (isMobile ? openMobile : open) return null
  return (
    <SidebarTrigger
      className="group/toggle ml-3 h-11 w-11 overflow-hidden border-0 p-0 transition-[width,margin,opacity] duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)]:ml-0 [@media(hover:hover)]:w-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/queue-control:ml-3 [@media(hover:hover)]:group-focus-within/queue-control:w-11 [@media(hover:hover)]:group-focus-within/queue-control:opacity-100 [@media(hover:hover)]:group-hover/queue-control:ml-3 [@media(hover:hover)]:group-hover/queue-control:w-11 [@media(hover:hover)]:group-hover/queue-control:opacity-100"
      aria-label="Toggle queue"
    >
      <QueueIcon aria-hidden="true" className="group-hover/toggle:hidden" />
      <SidebarIcon
        aria-hidden="true"
        className="hidden group-hover/toggle:block"
      />
    </SidebarTrigger>
  )
}
