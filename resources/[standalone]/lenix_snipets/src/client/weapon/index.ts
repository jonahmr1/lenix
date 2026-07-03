on('ox:playerLoaded', (playerId: number, isNew: boolean) => {
  SendNuiMessage(JSON.stringify({
		state: false
	}))
});

on('ox:startCharacterSelect', () => {
	SendNuiMessage(JSON.stringify({
		state: false
	}))
});
