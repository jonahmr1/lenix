import * as vscode from 'vscode';
import { composeCommitMessage } from './composer';
import { statusBar } from './bar';
import notify from './notify';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('lenix.settings', notify.statusBar);
	const bar = statusBar()
	vscode.commands.registerCommand("lenix.composeCommit", () => composeCommitMessage(context, bar))
	context.subscriptions.push(bar);
}

export function deactivate() {}
