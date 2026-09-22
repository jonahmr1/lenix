import * as vscode from 'vscode'

let channel: vscode.OutputChannel | undefined

export const logger = {
	init: () => {
		channel = vscode.window.createOutputChannel('Lenix')
		// channel.show() caused auto-select Output bar on window reload
		console.log('Welcome to Lenix extension')
	},
	log: (msg: string) => {
		if (channel) channel.appendLine(msg)
		else console.log('[lenix]', msg) // fallback
	},
}
