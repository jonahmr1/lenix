import * as vscode from 'vscode';
import { composeCommitMessage } from './composer';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('lenix.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Lenix!');
	});

	const bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
	bar.command = 'lenix.settings'
	bar.text = '$(edit-sparkle) Lenix'
	bar.tooltip = 'Open Lenix in settings'
	bar.show()

	const settings = vscode.commands.registerCommand('lenix.settings', () => {
		vscode.window.showInformationMessage('Lenix commit message composer', 'Open Lenix in settings').then((action) => {
			if (action === 'Open Lenix in settings') vscode.commands.executeCommand('workbench.action.openSettings', 'lenix.')
		});
	});

	vscode.commands.registerCommand("lenix.composeCommit", () => composeCommitMessage(context))

	context.subscriptions.push(disposable, bar, settings);
}

export function deactivate() {
	vscode.window.showWarningMessage('Lenix is deactivated');
}
