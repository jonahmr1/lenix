import { addCommand, triggerClientCallback } from "@overextended/ox_lib/server";

addCommand(
  'creategroup',
  async (source, args) => {
		const input = await triggerClientCallback<{
			name: string
			label: string
			hasAccount: string
			grades: string
		}>('ox:createGroup', source, args.gradesCount)
		if (!input) return

		console.debug(input)

		const {
			name, label, hasAccount, grades
		} = input

		//@ts-ignore
		exports.ox_core.CreateGroup({
			name,
			label,
			hasAccount,
			grades
		})
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