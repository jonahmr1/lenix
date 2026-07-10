import Radio from './apps/radio'
import Hud from './apps/hud'
import { Roster } from './apps/roster'

export const DEV: boolean = false
console.log('loaded')
export default () => {
	return (
		<div className={`${DEV && 'bg-black/75'} w-full h-screen relative`}>
			<Hud />
			<Radio />
			<Roster />
		</div>
	)
}
