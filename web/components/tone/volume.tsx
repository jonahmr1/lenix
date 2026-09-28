import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { SpeakerSimpleHighIcon, SpeakerSimpleLowIcon, SpeakerSimpleNoneIcon, SpeakerSimpleSlashIcon } from '@phosphor-icons/react'
import { storage } from '@lenix/lenix'
import { YouTubePlayer } from 'react-youtube'

interface Volume {
	value: number
	isMuted: boolean
}

export const Volume = ({ player }: { player: YouTubePlayer | null }) => {
	const [state, setState] = useState<Volume>()

	useEffect(() => {
		if (!state) {
			const value = storage.get<Volume, 'value'>('value')
			const isMuted = storage.get<Volume, 'isMuted'>('isMuted')
			setState({
				value: value === null ? 20 : Number(value),
				isMuted: isMuted === null ? false : isMuted === 'true'
			})
			return
		}
		
		player?.setVolume(state.isMuted ? 0 : state.value)

		let last = state
		const timeout = setTimeout(() => {
			if (last !== state) return

			storage.set<Volume, 'value'>('value', state.value)
			storage.set<Volume, 'isMuted'>('isMuted', state.isMuted)
		}, 1000)

		return () => clearTimeout(timeout)
	}, [state, player])

	if (!state) return null

	return (
		<Tooltip>
			<TooltipTrigger className='flex items-center' asChild>
				<Button
					size="icon-sm"
					variant="ghost"
					className='*:size-full'
					onClick={() => setState(prev => prev ? ({ ...prev, isMuted: !state.isMuted }) : prev)}
				>
					{state.isMuted
					? <SpeakerSimpleSlashIcon />
					: state.value === 0
					? <SpeakerSimpleNoneIcon />
					: state.value < 50
					? <SpeakerSimpleLowIcon />
					: <SpeakerSimpleHighIcon />}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<Slider
					orientation="vertical"
					defaultValue={[state.value]}
					onValueChange={value => setState(prev => prev ? ({ ...prev, value: value[0] }) : prev)}
					max={100}
					step={1}
					className="invert **:data-[slot=slider-track]:bg-foreground/20"
				/>
			</TooltipContent>
		</Tooltip>
	)
}