import { Radio } from './apps/radio'
import { Hud } from './apps/hud'
import { Roster } from './apps/roster'
import { TopScore } from './apps/topscore'

export const DEV: boolean = true

export default () => {
	document.documentElement.classList.add('dark')
	return (
		<div className={`${DEV && 'bg-black/75'} w-full h-screen relative`}>
			<Hud />
			<TopScore />
			<Radio />
			<Roster />
		</div>
	)
}
