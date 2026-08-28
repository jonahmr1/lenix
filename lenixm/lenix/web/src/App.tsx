import { EnabledClientScripts } from 'scripts'
import { Radio } from './apps/radio'
import type { ClientScript, WebScript } from 'types/dirs'

export const DEV = false

const apps = {
	radio: Radio,
} satisfies Record<WebScript, React.ComponentType>

export const App = () => {
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
