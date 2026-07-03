import { inputDialog, onServerCallback } from "@overextended/ox_lib/client";

onServerCallback('ox:createGroup', async () => {
	const input = await inputDialog('Create new group', [
		{
			type: 'input',
			label: 'Name'
		},
		{
			type: 'input',
			label: 'Label'
		},
		{
			type: 'input',
			label: 'Label of the highest role'
		},
		{
			type: 'checkbox',
			label: 'Create an account?'
		},
	], {})
	if (!input) return
	console.debug(input)
	return {
		name: input[0],
		label: input[1],
		grade: input[2],
		hasAccount: input[3],
	}
})
