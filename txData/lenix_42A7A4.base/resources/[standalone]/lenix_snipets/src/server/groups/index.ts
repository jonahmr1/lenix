import { addCommand, triggerClientCallback } from "@overextended/ox_lib/server";

addCommand(
  'creategroup',
  async (source) => {
		const input = await triggerClientCallback<{
			name: string
			label: string
			hasAccount: string
			grade: string
		}>('ox:createGroup', source)
		if (!input) return

		console.debug(input)

		const {
			name, label, hasAccount, grade
		} = input

		//@ts-ignore
		exports.ox_core.CreateGroup({
			name,
			label,
			hasAccount,
			grades: [
				{
					label: grade,
					accountRole: 'viewer'
				}
			]
		})
  },
  {
    help: 'Create new group to the db.',
    restricted: 'group.admin',
  },
);