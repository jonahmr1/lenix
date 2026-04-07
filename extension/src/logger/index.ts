import * as vscode from 'vscode'

let channel: vscode.OutputChannel | undefined

export const logger = {
	init: () => {
		channel = vscode.window.createOutputChannel('Lenix')
		channel.show()
	},
	log: (msg: string) => {
		if (channel) channel.appendLine(msg)
		else console.log('[lenix]', msg) // fallback
	},
}
