import * as vscode from 'vscode';
import { composeCommitMessage } from './composer';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('lenix.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Lenix!');
	});

	vscode.commands.registerCommand("lenix.composeCommit", () => composeCommitMessage(context))

	context.subscriptions.push(disposable);
}

export function deactivate() {
	vscode.window.showWarningMessage('Lenix is deactivated');
}
