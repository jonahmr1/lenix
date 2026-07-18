import { cache, notify, requestAnimDict } from '@overextended/ox_lib/client'
import type { Events, Requests } from 'types/index'
import { client, emitEvent, onNui } from 'lenix/client'

const dict = 'cellphone@'
const anim = 'cellphone_text_read_base'
let state = false
let radioProp = 0

const leaveChannel = () => globalThis.exports['pma-voice'].setRadioChannel(0)

const toggleRadioAnimation = async () => {
	await requestAnimDict(dict)

	if (state) {
		client.entity.playAnim(dict, anim)
		client.entity.stopAnim(dict)

		radioProp = CreateObject(GetHashKey('prop_cs_hand_radio'), 1.0, 1.0, 1.0, true, true, false)

		AttachEntityToEntity(
			radioProp,
			cache.ped,
			GetPedBoneIndex(cache.ped, 57005),
			0.14,
			0.01,
			-0.02,
			110.0,
			120.0,
			-15.0,
			true,
			false,
			false,
			false,
			2,
			true,
		)
	} else {
		StopAnimTask(cache.ped, dict, anim, 1.0)
		ClearPedTasks(cache.ped)

		if (radioProp) {
			DeleteObject(radioProp)
			radioProp = 0
		}
	}
}

on('lenix:client:radio', () => {
	state = true
	SetNuiFocus(true, true)
	emitEvent<Events['displayRadio']>('radio:display', state)
	toggleRadioAnimation()
})

onNui<Requests['changeFrequency']>('radio:frequency', ({ frequency }) => {
	const channel = Number(frequency)
	if (channel > 500) {
		notify({
			type: 'error',
			title: 'Failed',
			description: 'The frequency cannot exceed 500'
		})
		return false
	}
	notify({ title: `Set to #${frequency}` })
	globalThis.exports['pma-voice'].setRadioChannel(channel)
	return true
})

onNui<Requests['leaveRadio']>('radio:leave', () => {
	leaveChannel()
	return true
})

onNui<Requests['closeRadio']>('radio:close', () => {
	state = false
	SetNuiFocus(false, false)
	toggleRadioAnimation()
	return true
})
