import * as vscode from 'vscode';

export const statusBar = () => {
  const bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
  bar.command = 'lenix.settings'
  bar.text = '$(edit-sparkle) Lenix'
  bar.tooltip = 'Open Lenix in settings'
  bar.show()
  return bar
}