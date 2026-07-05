let state = false
on('ox:radio', () => {
	state = true
	SetNuiFocus(true, true)
	SendNuiMessage(JSON.stringify({
		key: 'radio:display',
		value: true
	}))
})

RegisterNuiCallback('radio:frequency', (data: { frequency: string }, cb: Function) => {
	exports['pma-voice'].setRadioChannel(Number(data.frequency))
	cb(true)
})

RegisterNuiCallback('radio:leave', (_: unknown, cb: Function) => {
	exports['pma-voice'].setRadioChannel(0)
	cb(true)
})

RegisterNuiCallback('radio:close', (_: unknown, cb: Function) => {
	state = false
	SetNuiFocus(false, false)
	cb(true)
})
