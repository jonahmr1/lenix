'use client'

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type {
	YoutubeSearchParams,
	YoutubeVideoSearch,
} from 'youtube.ts/dist/types'
import he from 'he'
import { Thumbnail } from '../thumbnail'
import { Live } from './live'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { useStates } from '@/hooks/useStates.old'
import { Kbd } from '../ui/kbd'

export const Search = () => {
	const { states, setStates } = useStates()

	const searchInput = useRef<HTMLInputElement>(null)
	const [cmdOpen, setOpen] = useState(false)
	const [videosFound, setVideos] = useState<YoutubeVideoSearch['items']>([])
	const [searchLoading, setLoading] = useState(false)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(open => !open)
				cmdOpen ? searchInput.current?.blur() : searchInput.current?.focus()
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [cmdOpen])

	const search = async () => {
		setVideos([])
		setLoading(true)
		try {
			const { items }: YoutubeVideoSearch = await states.youtube.get('search', {
				q: searchInput.current?.value ?? '',
				type: 'video',
				videoEmbeddable: 'true',
			} satisfies YoutubeSearchParams)
			setVideos(items)
		} catch (e: any) {
			toast.error('Error', {
				description: JSON.stringify(e),
			})
			throw e
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Command
				className={`h-fit w-1/3 border transition-all portrait:w-full ${cmdOpen ? 'shadow-lg' : 'border-transparent bg-transparent portrait:w-3/4 landscape:w-1/4'}`}
				shouldFilter={false}
			>
				<InputGroup>
					<InputGroupAddon>
						<MagnifyingGlassIcon />
					</InputGroupAddon>
					<InputGroupInput
						placeholder="Type what do you wanna play"
						ref={searchInput}
						onFocus={() => setOpen(true)}
						onBlur={() => setOpen(false)}
						className="text-xs focus:text-base landscape:transition-all"
						onKeyDown={e => {
							if (e.key === 'Enter') {
								e.preventDefault()
								e.stopPropagation()
								search()
								return
							}
							if (e.key === 'Escape') e.currentTarget.blur()
						}}
					/>
					<InputGroupAddon align="inline-end">
						{cmdOpen ? (
							<>
								<Kbd>⏎</Kbd>
							</>
						) : (
							<>
								<Kbd>{navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'}</Kbd>
								<Kbd>K</Kbd>
							</>
						)}
					</InputGroupAddon>
				</InputGroup>
				<CommandList className={`${!cmdOpen && 'hidden'}`}>
					<CommandEmpty className="flex justify-center">
						{searchLoading ? (
							<div className="flex gap-[0.5vw]">
								<span>Searching</span> <Spinner />
							</div>
						) : (
							'No results.'
						)}
					</CommandEmpty>
					{videosFound.length > 0 && (
						<CommandGroup heading="Results found">
							{videosFound.map(video => (
								<HoverCard key={video.etag}>
									<HoverCardTrigger asChild>
										<CommandItem
											value={video.etag}
											onMouseDown={e => {
												e.preventDefault()
												setStates(prev => ({
													...prev,
													video,
													currentTime: 0,
													autoplay: true,
												}))
												setOpen(false)
												searchInput.current?.blur()
											}}
										>
											<Thumbnail src={video.snippet.thumbnails.high.url} />
											<div className="flex items-start gap-[0.5vw]">
												{he.decode(video.snippet.title)}
												{video.snippet.liveBroadcastContent !== 'none' && (
													<Live>{video.snippet.liveBroadcastContent}</Live>
												)}
											</div>
										</CommandItem>
									</HoverCardTrigger>
									<HoverCardContent
										side="right"
										className="max-h-[50vh] overflow-y-auto"
									>
										{video.snippet.description}
									</HoverCardContent>
								</HoverCard>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</Command>
		</>
	)
}
