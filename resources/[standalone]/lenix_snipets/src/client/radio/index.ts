import { cache, notify, requestAnimDict } from "@overextended/ox_lib/client"

const dict = 'cellphone@'
const anim = 'cellphone_text_read_base'
let state = false
let radioProp = 0;

const leaveChannel = () => exports['pma-voice'].setRadioChannel(0)

const toggleRadioAnimation = async () => {
	await requestAnimDict(dict);

	if (state) {
		TaskPlayAnim(
			cache.ped,
			dict,
			anim,
			2.0,
			3.0,
			-1,
			49,
			0,
			false,
			false,
			false
		);
		RemoveAnimDict(dict)

		radioProp = CreateObject(
			GetHashKey('prop_cs_hand_radio'),
			1.0,
			1.0,
			1.0,
			true,
			true,
			false
		);

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
			true
		);
	} else {
		StopAnimTask(cache.ped, dict, anim, 1.0);
		ClearPedTasks(cache.ped);

		if (radioProp) {
			DeleteObject(radioProp);
			radioProp = 0;
		}
	}
};

on('ox:radio', () => {
	state = true
	SetNuiFocus(true, true)
	SendNuiMessage(JSON.stringify({
		key: 'radio:display',
		value: true
	}))
	toggleRadioAnimation()
})

RegisterNuiCallback('radio:frequency', (data: { frequency: string }, cb: Function) => {
	notify({ title: `Set to #${data.frequency}` })
	exports['pma-voice'].setRadioChannel(Number(data.frequency))
	cb(true)
})

RegisterNuiCallback('radio:leave', (_: unknown, cb: Function) => {
	leaveChannel()
	cb(true)
})

RegisterNuiCallback('radio:close', (_: unknown, cb: Function) => {
	state = false
	SetNuiFocus(false, false)
	toggleRadioAnimation()
	cb(true)
})
