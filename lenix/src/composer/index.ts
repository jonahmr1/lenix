import * as vscode from 'vscode';
import { execSync } from 'child_process'
import Ai from 'groq-sdk';
import { setup } from '../setup';

const defaultModel: string = 'llama-3.1-8b-instant' as const
const models: string[] = [
  "allam-2-7b",
  "canopylabs/orpheus-arabic-saudi",
  "canopylabs/orpheus-v1-english",
  "groq/compound",
  "groq/compound-mini",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-prompt-guard-2-22m",
  "meta-llama/llama-prompt-guard-2-86m",
  "moonshotai/kimi-k2-instruct",
  "moonshotai/kimi-k2-instruct-0905",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-safeguard-20b",
  "qwen/qwen3-32b",
  "whisper-large-v3",
  "whisper-large-v3-turbo",
] as const
let constructedInstance: false | Ai = false as const
let availableModels: string[] = [] as const
let modelChecked: boolean = false as const

const updateAiKey = (apiKey: string) => {
  if (!constructedInstance) {
    const instance = new Ai({ apiKey })
    constructedInstance = instance
    return instance
  }
  return constructedInstance
}

const checkAiModelsRace = async (apiKey: string) => {
  if (modelChecked) return
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json() as { data: { id: string }[] }
  availableModels = data.data.map(m => m.id)
  console.debug('Models not in local list:', availableModels.filter(m => !models.includes(m)))
  modelChecked = true
}

export const composeCommitMessage =  async (context: vscode.ExtensionContext) => {
  const apiKey = vscode.workspace.getConfiguration('lenix').get<string>('apiKey')
  if (!apiKey) return vscode.window.showInformationMessage(
    "Seems like you don't have an API key set, let's do that first",
    "Use Setup Page (recommended)",
    "Setup manually in settings"
  ).then(action => {
    if (action === 'Use Setup Page (recommended)') setup(context, defaultModel, models)
    else if (action === 'Setup manually in settings') vscode.commands.executeCommand('workbench.action.openSettings', 'lenix.apiKey')
    })

  await checkAiModelsRace(apiKey)

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!workspaceFolder) return vscode.window.showErrorMessage('No workspace open')

  const diff = execSync('git diff --cached', { cwd: workspaceFolder }).toString()
  if (diff === '') return vscode.window.showErrorMessage('No changes staged for commit')

  const ai = updateAiKey(apiKey)

  const model = vscode.workspace.getConfiguration('lenix').get<string>('aiModel')
  if (!model) return vscode.window.showErrorMessage('Unexpected: No model selected, it should\'ve been set by the setup process by default, but something went wrong')
  try {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.SourceControl,
      title: "Composing commit message...",
      cancellable: false
    }, async () => {
      const response = await ai.chat.completions.create({
        model,
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