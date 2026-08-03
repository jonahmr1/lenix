import type { OxAccountRole } from '@overextended/ox_core'
import { addCommand, triggerClientCallback } from '@overextended/ox_lib/server'
import { api } from 'lenix/server'

addCommand(
	'creategroup',
	async (source, args) => {
		const input = await triggerClientCallback<{
			name: string
			label: string
			hasAccount: string
			grades: {
				label: string
				accountRole: OxAccountRole
			}[]
		}>('lenix:createGroup', source, args.gradesCount)
		if (!input) return

		//@ts-ignore
		api.ox_core.CreateGroup(input)
	},
	{
		help: 'Create new group to the db.',
		params: [
			{
				name: 'gradesCount',
				paramType: 'number',
				optional: false,
			},
		],
		restricted: 'group.admin',
	},
)
