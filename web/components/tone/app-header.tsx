'use client'

import { useEffect } from 'react'
import { SidebarIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useApp } from '@/app/tone/provider'

export function AppHeader() {
  const { setState } = useApp()
  const { isMobile, toggleSidebar } = useSidebar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !['b', 'm'].includes(event.key.toLowerCase()) ||
        !event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.repeat ||
        (event.target instanceof HTMLElement &&
          event.target.closest(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
          ))
      )
        return

      event.preventDefault()
      if (event.key.toLowerCase() === 'b') {
        toggleSidebar()
        return
      }
      const key = isMobile ? 'queueMobileOpen' : 'queueOpen'
      setState(previous => ({ ...previous, [key]: !previous[key] }))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, setState, toggleSidebar])

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
