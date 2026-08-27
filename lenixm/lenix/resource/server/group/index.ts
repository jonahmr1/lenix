import { addCommand, checkDependency } from '@overextended/ox_lib/server'
import { api, onNetEvent } from 'lenix/server'
import type { CreateGroup } from 'types/index'

checkDependency('ox_core', '1.5.14', true)

const cmd = 'creategroup'

addCommand(
	cmd,
	async (source, args) => {
		emitNet('lenix:client:group:create', source, args.gradesCount)
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

onNetEvent('lenix:server:group:create', (source, group: CreateGroup) => {
	if (!IsPlayerAceAllowed(source.toString(), `command.${cmd}`)) return

	api.ox_core?.CreateGroup?.(group)
})