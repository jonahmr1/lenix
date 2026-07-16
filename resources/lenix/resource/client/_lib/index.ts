import { requestAnimDict } from "@overextended/ox_lib/client"

export const playAnim = async (
	dict: string,
	name: string,
	blendIn = 2.0,
	blendOut = 2.0,
	ped = PlayerPedId(),
	duration = -1,
	flag = 0,
	playbackFrom = 0.0,
	x = false,
	y = false,
	z = false
) => {
	await requestAnimDict(dict)
	TaskPlayAnim(ped, dict, name, blendIn, blendOut, duration, flag, playbackFrom, x, y, z)
}

export const stopAnim = (dict: string, ped = PlayerPedId()) => {
	RemoveAnimDict(dict)
	ClearPedTasks(ped)
}