import * as vscode from 'vscode';

const statusBar = () => {
  vscode.window.showInformationMessage('Lenix: commit message composer', 'Open Lenix in settings').then((action) => {
    if (action === 'Open Lenix in settings') vscode.commands.executeCommand('workbench.action.openSettings', 'lenix.')
  });
}

const setup = (handler: () => void) => {
  vscode.window.showInformationMessage(
    "Lenix: Seems like you don't have an API key set, let's do that first",
    "Use Setup Page (recommended)",
    "Setup manually in settings"
  ).then(action => {
    if (action === 'Use Setup Page (recommended)') handler()
    else if (action === 'Setup manually in settings') vscode.commands.executeCommand('workbench.action.openSettings', 'lenix.apiKey')
    })
}

export default {
  setup,
  statusBar
}