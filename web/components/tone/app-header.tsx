'use client'

import { useHotkeys } from 'react-hotkeys-hook'
import { SidebarIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useApp } from '@/app/tone/provider'

export function AppHeader() {
  const { setState } = useApp()
  const { isMobile, toggleSidebar } = useSidebar()

  useHotkeys(
    'ctrl+b',
    toggleSidebar,
    {
      preventDefault: true,
      useKey: true,
      ignoreEventWhen: event => event.repeat,
    },
    [toggleSidebar]
  )
  useHotkeys(
    'ctrl+m',
    () => {
      const key = isMobile ? 'queueMobileOpen' : 'queueOpen'
      setState(previous => ({ ...previous, [key]: !previous[key] }))
    },
    {
      preventDefault: true,
      useKey: true,
      ignoreEventWhen: event => event.repeat,
    },
    [isMobile, setState]
  )

  return (
    <header className='flex shrink-0 items-center justify-between border-b p-2 md:hidden'>
      <SidebarTrigger aria-label='Open playlists' />
      <Button
        variant='ghost'
        size='sm'
        onClick={() =>
          setState(previous => ({ ...previous, queueMobileOpen: true }))
        }
      >
        <SidebarIcon />
      </Button>
    </header>
  )
}
