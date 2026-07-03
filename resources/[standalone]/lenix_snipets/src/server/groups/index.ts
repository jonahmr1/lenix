import type { OxAccountRole } from "@overextended/ox_core";
import { addCommand, triggerClientCallback } from "@overextended/ox_lib/server";

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
		}>('ox:createGroup', source, args.gradesCount)
		if (!input) return

		//@ts-ignore
		exports.ox_core.CreateGroup(input)
  },
  {
    help: 'Create new group to the db.',
		params: [{
			name: 'gradesCount',
			type: 'number',
			optional: false
		}],
    restricted: 'group.admin',
  },
);