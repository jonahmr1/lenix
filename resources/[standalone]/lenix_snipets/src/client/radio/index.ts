on('ox:radio', () => {
	SendNuiMessage(JSON.stringify({
		key: 'radio:display',
		value: true
	}))
	SetNuiFocus(true, true)
	SetNuiFocusKeepInput(true)
})

RegisterNuiCallback('radio:frequency', (data: { frequency: string }) => {
	exports['pma-voice'].setRadioChannel(Number(data.frequency))
	exports['pma-voice'].setVoiceProperty('radioEnabled', true)
	exports['pma-voice'].setVoiceProperty('micClicks', true)
})

RegisterNuiCallback('radio:leave', () => {
	exports['pma-voice'].setRadioChannel(0)
	exports['pma-voice'].setVoiceProperty('radioEnabled', false)
	exports['pma-voice'].setVoiceProperty('micClicks', false)
})

RegisterNuiCallback('radio:close', () => {
	SetNuiFocus(false, false)
	SetNuiFocusKeepInput(false)
})