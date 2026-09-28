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
import { asserts, S } from '@lenix/lenix'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { YoutubeSearchParams, YoutubeVideoSearch } from 'youtube.ts/dist/types'
import YoutubeAPI from 'youtube.ts/dist/API'
import he from 'he'
import { Thumbnail } from '../thumbnail'


/* TODO: conceal */
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
asserts(apiKey, 'YOUTUBE_API_KEY missing')

const youtube = new YoutubeAPI(apiKey)


export const Search = ({
	setSelected,
}: {
	setSelected: S<YoutubeVideoSearch['items'][number] | null>
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
			setVideos(items)
		} catch (e) {
			toast.error('Error')
			throw e
		} finally {
			setLoading(false)
		}
	}

	return <>
		<InputGroup className="max-w-2/3 portrait:max-w-none">
			<InputGroupInput
				placeholder="Type what do you wanna play"
				onClick={() => setOpen(true)}
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
							<>
								Searching <Spinner />
							</>
						) : (
							'No results.'
						)}
					</CommandEmpty>
					{videosFound.length > 0 && (
						<CommandGroup heading="Results found">
							{videosFound.map((video) => (
								<CommandItem
									key={video.etag}
									value={video.etag}
									onSelect={() => {
										setSelected(video)
										setOpen(false)
									}}
								>
									<Thumbnail src={video.snippet.thumbnails.high.url} />
									{he.decode(video.snippet.title)}
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</Command>
		</CommandDialog>
	</>
}
