import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { S } from '@lenix/lenix'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { YoutubeSearchParams, YoutubeVideo, YoutubeVideoSearch } from 'youtube.ts/dist/types'
import he from 'he'
import { Thumbnail } from '../thumbnail'
import { Live } from './live'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import YoutubeAPI from 'youtube.ts/dist/API'

export const Search = ({
	setSelected,
	youtube
}: {
	setSelected: S<YoutubeVideoSearch['items'][number] | null>
	youtube: YoutubeAPI
}) => {
	const [searchInput, setInput] = useState('')
	const [cmdOpen, setOpen] = useState(false)
	const [videosFound, setVideos] = useState<YoutubeVideoSearch['items']>([])
	const [searchLoading, setLoading] = useState(false)

	const search = async () => {
		setVideos([])
		setLoading(true)
		try {
			const { items }: YoutubeVideoSearch = await youtube.get('search', {
				q: searchInput,
				type: 'video',
				videoEmbeddable: 'true',
			} satisfies YoutubeSearchParams)
			if (!items.length) return setVideos(items)

			const { items: fullVideos } = await youtube.get('video', {
				id: items.map(({ id }) => id.videoId).join(','),
				part: 'snippet',
			}) as { items: YoutubeVideo[] }
			const descriptions = new Map(fullVideos.map(({ id, snippet }) => [id, snippet.description]))

			setVideos(items.map((video) => ({
				...video,
				snippet: {
					...video.snippet,
					description: descriptions.get(video.id.videoId) ?? video.snippet.description,
				},
			})))
		} catch (e: any) {
			toast.error('Error', {
				description: JSON.stringify(e)
			})
			throw e
		} finally {
			setLoading(false)
		}
	}

	return <>
		<InputGroup className="max-w-2/3 portrait:max-w-none">
			<InputGroupInput
				placeholder="Type what do you wanna play"
				onFocus={() => setOpen(true)}
			/>
			<InputGroupAddon>
				<MagnifyingGlassIcon />
			</InputGroupAddon>
		</InputGroup>
		<CommandDialog open={cmdOpen} onOpenChange={setOpen}>
			<Command className="border" shouldFilter={false}>
				<CommandInput
					placeholder="Search..."
					value={searchInput}
					onValueChange={setInput}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							e.stopPropagation()
							search()
						}
					}}
				/>
				<CommandList>
					<CommandEmpty className="flex justify-center">
						{searchLoading ? (
							<div className='flex gap-[0.5vw]'>
								<span>Searching</span> <Spinner />
							</div>
						) : (
							'No results.'
						)}
					</CommandEmpty>
					{videosFound.length > 0 && (
						<CommandGroup heading="Results found">
							{videosFound.map((video) => (
								<HoverCard key={video.etag}>
									<HoverCardTrigger asChild>
										<CommandItem
											value={video.etag}
											onSelect={() => {
												setSelected(video)
												setOpen(false)
											}}
										>
											<Thumbnail src={video.snippet.thumbnails.high.url} />
											<div className='flex items-start gap-[0.5vw]'>
												{he.decode(video.snippet.title)}
												{video.snippet.liveBroadcastContent !== 'none' && <Live>{video.snippet.liveBroadcastContent}</Live>}
											</div>
										</CommandItem>
									</HoverCardTrigger>
									<HoverCardContent side='right' className='max-h-[50vh] overflow-y-auto'>
										{video.snippet.description}
									</HoverCardContent>
								</HoverCard>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</Command>
		</CommandDialog>
	</>
}
