import { addKeybind, cache, requestAnimDict } from "@overextended/ox_lib/client"
import { playAnim } from "../_lib"

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
			playAnim('missminuteman_1ig_2', 'handsup_base')
		}
		handsUp = !handsUp
	}
})
