import * as vscode from 'vscode';
import { execSync } from 'child_process'
import Ai from 'groq-sdk';
import { setup } from '../setup';

let constructedInstance: false | Ai = false

const updateAiKey = (apiKey: string) => {
  if (!constructedInstance) {
    const instance = new Ai({ apiKey })
    constructedInstance = instance
    return instance
  }
  return constructedInstance
}

export const composeCommitMessage =  async (context: vscode.ExtensionContext) => {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!workspaceFolder) return vscode.window.showErrorMessage('No workspace open')

  const apiKey = vscode.workspace.getConfiguration('lenix').get<string>('apiKey')
  if (!apiKey) return vscode.window.showInformationMessage(
    "Start the setup",
    "Start"
  ).then(() => setup(context))
  const ai = updateAiKey(apiKey)

  const diff = execSync('git diff --cached', { cwd: workspaceFolder }).toString()
  if (diff === '') return vscode.window.showErrorMessage('No changes staged for commit')

  try {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.SourceControl,
      title: "Composing commit message...",
      cancellable: false
    }, async () => {
      const response = await ai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: `Generate a single git commit message following Conventional Commits format (type(scope): description). Return only the commit message, no explanation, no quotes, no alternatives:\n\n${diff}`
          }
        ]
      })
      const commitMessage = response.choices[0].message.content
      if (typeof commitMessage !== 'string') return vscode.window.showErrorMessage('Expected the response from the LLM to have a string in nest')

      const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
      const git = gitExtension.getAPI(1)
      const repo = git.repositories[0]
      repo.inputBox.value = commitMessage
    })
  } catch (error) {
    vscode.window.showErrorMessage('Composer throwed')
    throw error
  }
}