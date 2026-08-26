import { cache, checkDependency, requestAnimDict } from '@overextended/ox_lib/client'
import { control, entity } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)

let handsUp: boolean = false

control.on({
	event: 'press',
	key: 'X',
	onEvent: async () => {
		if (Player(cache.ped).state.isCuffed) return

		await requestAnimDict('missminuteman_1ig_2')
		if (handsUp) {
			ClearPedTasks(cache.ped)
		} else {
			entity.playAnim(cache.ped, 'missminuteman_1ig_2', 'handsup_base')
		}
		handsUp = !handsUp
	},
})
