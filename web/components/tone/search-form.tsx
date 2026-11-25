'use client'

import { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { useSidebar } from '@/components/ui/sidebar'
import { useApp } from '@/app/tone/provider'
import { searchTracks } from '@/lib/tone/search-actions'

export function SearchForm() {
  const { state, setState } = useApp()
  const searchInput = useRef<HTMLInputElement>(null)
  const { isMobile } = useSidebar()
  useHotkeys('ctrl+k', () => searchInput.current?.focus(), {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    useKey: true,
    ignoreEventWhen: event =>
      event.repeat ||
      (event.target instanceof HTMLElement &&
        !!event.target.closest('[role="dialog"]')),
  })
  return (
    <form
      role='search'
      onSubmit={async event => {
        event.preventDefault()
        if (state.searchLoading || state.searchMoreLoading) return
        const query = state.searchQuery.trim()
        if (!query) {
          toast.error('Enter a song or artist.')
          return
        }
        setState(previous => ({ ...previous, searchLoading: true }))
        try {
          const result = await searchTracks(query)
          if ('error' in result) {
            toast.error(result.error)
            return
          }
          setState(previous => ({
            ...previous,
            searchResults: result.tracks,
            searchActiveQuery: query,
            searchNextPageToken: result.nextPageToken,
          }))
        } catch {
          toast.error('Couldn’t search YouTube. Please try again.')
        } finally {
          setState(previous => ({ ...previous, searchLoading: false }))
        }
      }}
    >
      <InputGroup>
        <InputGroupInput
          ref={searchInput}
          aria-keyshortcuts='Control+k'
          aria-label='Search YouTube'
          placeholder='Search songs or artists on YouTube'
          value={state.searchQuery}
          disabled={state.searchLoading || state.searchMoreLoading}
          className='text-base'
          onChange={event =>
            setState(previous => ({
              ...previous,
              searchQuery: event.target.value,
            }))
          }
        />
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupAddon align='inline-end' className='gap-2'>
          {!isMobile && (
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          )}
          <InputGroupButton
            type='submit'
            disabled={state.searchLoading || state.searchMoreLoading}
            aria-label='Search'
            variant='secondary'
            className='rounded-sm border-0'
          >
            {state.searchLoading ? <Spinner /> : 'Search'}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
