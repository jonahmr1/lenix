import { inputDialog, onServerCallback } from '@overextended/ox_lib/client'

onServerCallback('ox:createGroup', async (count: number) => {
	const input = await inputDialog(
		'Create new grade',
		[
			{
				type: 'input',
				label: 'Name',
			},
			{
				type: 'input',
				label: 'Label',
			},
			...Array.from({ length: count }, (_, i) => [
				{
					type: 'input' as const,
					label: `Grade ${i + 1} Label`,
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
				label: 'Create an account?',
			},
		],
		{},
	)
	if (!input) return

	return {
		name: input[0],
		label: input[1],
		grades: Array.from({ length: count }, (_, i) => ({
			label: input[2 + i * 2],
			accountRole: input[3 + i * 2],
		})),
		hasAccount: input[4],
	}
})
