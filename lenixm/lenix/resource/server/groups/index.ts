import { addCommand, checkDependency, triggerClientCallback } from '@overextended/ox_lib/server'
import { api } from 'lenix/server'
import type { CreateGroup } from 'types/index'

checkDependency('oxmysql', '2.14.1', true)
checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_core', '1.5.14', true)

addCommand(
	'creategroup',
	async (source, args) => {
		const input = await triggerClientCallback<CreateGroup | undefined>('lenix:createGroup', source, args.gradesCount)
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
