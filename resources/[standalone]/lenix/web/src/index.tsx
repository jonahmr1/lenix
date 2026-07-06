import Radio from "./apps/radio"
import Weapon from "./apps/hud"

export const DEV: boolean = false

export default () => {
	return (
		<div className={`${DEV && 'bg-black/75'} w-full h-screen relative`}>
			<Weapon />
			<Radio />
		</div>
	)
}