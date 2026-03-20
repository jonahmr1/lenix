import * as vscode from 'vscode';
import { composeCommitMessage } from './composer';
import { statusBar } from './bar';
import notify from './notify';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('lenix.settings', notify.statusBar);
	vscode.commands.registerCommand("lenix.composeCommit", () => composeCommitMessage(context))

	context.subscriptions.push(statusBar());
}

export function deactivate() {
	vscode.window.showWarningMessage('Lenix: Lenix is deactivated');
}
