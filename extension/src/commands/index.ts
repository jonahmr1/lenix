import * as vscode from 'vscode'
import notify from '../notify'

export const registerReportCommand = (
	racedList: string[],
	bar: vscode.StatusBarItem,
): void => {
	vscode.commands.registerCommand('lenix.report', () =>
		notify.report(racedList, bar),
	)
}
