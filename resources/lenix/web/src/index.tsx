import Radio from './apps/radio'
import Weapon from './apps/hud'
import { Roster } from './apps/roster'

export const DEV: boolean = true

export default () => {
	return (
		<div className={`${DEV && 'bg-black/75'} w-full h-screen relative`}>
			<Weapon />
			<Radio />
			<Roster />
		</div>
	)
}
