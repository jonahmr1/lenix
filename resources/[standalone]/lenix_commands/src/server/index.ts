import { addCommand } from "@overextended/ox_lib/server";

addCommand(
	"test",
	async (source, args) => {
		await exports.ox_inventory.AddItem(args[2] ?? source, args[0], args[1] ?? 1)
	},
	{
		name: "giveitem",
		help: "give item to a someone",
		params: [
			{
				name: "Item name",
				help: "Name of the item",
				type: "string",
				optional: false
			},
			{
				name: "Item quantity",
				help: "Qunatity of the item to give",
				type: "number",
				optional: true
			},
			{
				name: "Target",
				help: "Who are you gonna give it to",
				type: "playerId",
				optional: true
			},
		],
		restricted: true
	}
)