import { inputDialog, onServerCallback } from "@overextended/ox_lib/client";

onServerCallback('ox:createGroup', async (count: number) => {
	console.debug(count)
	const input = await inputDialog('Create new grade', [
		{
			type: 'input',
			label: 'Name'
		},
		{
			type: 'input',
			label: 'Label'
		},
		...Array.from({ length: count }, (_, i) => [
			{
				type: 'input' as const,
				label: `Grade ${i + 1} Name`,
			},
			{
				type: 'select' as const,
				label: `Grade ${i + 1} Account Role`,
				options: [
					{ value: 'viewer', label: 'Viewer' },
					{ value: 'contributor', label: 'Contributor' },
					{ value: 'manager', label: 'Manager' },
					{ value: 'owner', label: 'Owner' },
				],
			},
		]).flat(),
		{
			type: 'checkbox',
			label: 'Create an account?'
		},
	], {})
	if (!input) return

	return {
		name: input[0],
		label: input[1],
		grades: [{
			label: input[2],
			accountRole: input[3]
		}],
		hasAccount: input[4],
	}
})
