import { addKeybind, cache, requestAnimDict } from "@overextended/ox_lib/client"

let handsUp: boolean = false

addKeybind({
	name: 'lenix:handsup',
	description: 'Toggle Hands Up',
	defaultKey: 'x',
	onPressed: async () => {
		if (Player(cache.ped).state.isCuffed) return

		await requestAnimDict('missminuteman_1ig_2')
		if (handsUp) {
			ClearPedTasks(cache.ped)
		} else {
			TaskPlayAnim(cache.ped, 'missminuteman_1ig_2', 'handsup_base', 2.0, 2.0, -1, 50, 0, false, false, false)
		}
		handsUp = !handsUp
	}
})
