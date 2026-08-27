import type { OxAccountRole } from '@overextended/ox_core'
import { checkDependency, inputDialog, onServerCallback } from '@overextended/ox_lib/client'
import type { CreateGroup } from 'types'

checkDependency('ox_lib', '3.39.0', true)

onServerCallback('lenix:createGroup', async (count: number): Promise<CreateGroup | undefined> => {
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
					] satisfies {
						value: OxAccountRole
						label: string
					}[],
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
		name: input[0] as string,
		label: input[1] as string,
		grades: Array.from({ length: count }, (_, i) => ({
			label: input[2 + i * 2] as string,
			accountRole: input[3 + i * 2] as OxAccountRole,
		})),
		hasAccount: input[4] as string,
	}
})
