import { EnabledClientScripts } from 'common'
import { Radio } from './apps/radio'
import { Hud } from './apps/hud'
import { Roster } from './apps/roster'
import { TopScore } from './apps/topscore'
import type { ClientScript, WebScript } from 'types/dirs'

export const DEV: boolean = false

const apps = {
	hud: Hud,
	radio: Radio,
	roster: Roster,
	topscore: TopScore,
} satisfies Record<WebScript, React.ComponentType>

export default () => {
	document.documentElement.classList.add('dark')

	return (
		<div className={`${DEV && 'bg-muted'} w-full h-screen relative`}>
			{EnabledClientScripts.filter((script: ClientScript): script is WebScript => script in apps).map(script => {
				const App = apps[script]
				return <App key={script} />
			})}
		</div>
	)
}
