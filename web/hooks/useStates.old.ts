import { StatesContext } from '@/app/_tone/provider'
import { useContext } from 'react'

export const useStates = () => {
	const context = useContext(StatesContext)
	if (!context) throw 'StatesProvider is missing'

	return context
}
