import * as vscode from 'vscode';

export const setup = (context: vscode.ExtensionContext, defaultModel: string, models: string[]) => {
  const panel = vscode.window.createWebviewPanel(
    'lenixSetup',
    'Lenix Setup',
    vscode.ViewColumn.One,
    { enableScripts: true, localResourceRoots: [context.extensionUri] }
  )

  panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, defaultModel, models)

  panel.webview.onDidReceiveMessage(async msg => {
    await vscode.workspace.getConfiguration('lenix').update('apiKey', msg.key, true)
    await vscode.workspace.getConfiguration('lenix').update('aiModel', msg.model, true)
    vscode.window.showInformationMessage('Setup complete!')
    panel.dispose()
  })
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, defaultModel: string, models: string[]): string {
  const toolkitUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/webview-ui-toolkit', 'dist', 'toolkit.js')
  )

  return (
  `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <script type="module" src="${toolkitUri}"><\/script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'IBM Plex Sans', sans-serif;
        background: var(--vscode-editor-background);
        color: var(--vscode-foreground);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .card {
        width: 100%;
        max-width: 420px;
        border: 1px solid var(--vscode-panel-border);
        padding: 2.5rem;
        animation: fadeUp 0.4s ease both;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .badge {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--vscode-descriptionForeground);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .badge::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4ade80;
        box-shadow: 0 0 6px #4ade80;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      h1 {
        font-size: 1.4rem;
        font-weight: 500;
        margin-bottom: 0.4rem;
        letter-spacing: -0.02em;
      }

      .subtitle {
        font-size: 0.8rem;
        color: var(--vscode-descriptionForeground);
        margin-bottom: 2rem;
        font-weight: 300;
      }

      .steps {
        list-style: none;
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .steps li {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 0.85rem;
        opacity: 0;
        animation: fadeUp 0.3s ease both;
      }

      .steps li:nth-child(1) { animation-delay: 0.1s; }
      .steps li:nth-child(2) { animation-delay: 0.2s; }
      .steps li:nth-child(3) { animation-delay: 0.3s; }
      .steps li:nth-child(4) { animation-delay: 0.4s; }

      .step-num {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        color: var(--vscode-descriptionForeground);
        min-width: 18px;
        padding-top: 2px;
      }

      a { color: var(--vscode-textLink-foreground); text-decoration: none; }
      a:hover { text-decoration: underline; }

      vscode-text-field {
        width: 100%;
        margin-bottom: 1rem;
      }

      vscode-button {
        width: 100%;
      }

      .success {
        display: none;
        text-align: center;
        margin-top: 1rem;
        font-size: 0.8rem;
        color: #4ade80;
        font-family: 'IBM Plex Mono', monospace;
        animation: fadeUp 0.3s ease both;
      }
    </style>
    </head>
    <body>
    <div class="card">
      <div class="badge">Lenix — one-time setup</div>
      <h1>Connect to Groq</h1>
      <ol class="steps">
        <li><span class="step-num">01</span><span>Login into your account or create one if you don't have one already <a href="https://console.groq.com/home">console.groq.com/home</a></span></li>
        <li><span class="step-num">02</span><span>Go to <a href="https://console.groq.com/keys">console.groq.com/keys</a> and Click <strong>Create API Key</strong> if you don't have one then submit</span></li>
        <li><span class="step-num">03</span><span>Click <strong>Copy</strong> and Paste your key in the input below</span></li>
      </ol>
      <vscode-text-field id="key" type="password" placeholder="gsk_...">API Key <span style="color:red">*</span></vscode-text-field>
      <vscode-text>Select model</vscode-text>
      <vscode-dropdown id="model" style="width:100%;margin-bottom:1rem">
        ${models.map(m => `<vscode-option value="${m}"${m === defaultModel ? ' selected' : ''}>${m}</vscode-option>`).join('')}
      </vscode-dropdown>
      <vscode-text>If you don't know what to choose the best for you, we recommed you pick one of the recommended model listed below based on your needs (rate limits, models, plans pricing, etc):</vscode-text>
      <ul>
        <li><span>🏆 Best overall / most intelligent: <strong>openai/gpt-oss-120b</strong></span></li>
        <li><span>⚡ Best for speed: <strong>llama-3.1-8b-instant</strong></span></li>
        <li><span>🧠 Best for reasoning / hard problems: <strong>qwen/qwen3-32b</strong></span></li>
        <li><span>🌐 Best for long documents: <strong>moonshotai/kimi-k2-instruct-0905</strong></span></li>
        <li><span>🔧 Best for tool use / function calling: <strong>llama-3.3-70b-versatile</strong></span></li>
        <li><span>🔍 Best with built-in web search: <strong>groq/compound</strong></span></li>
      </ul>

      <vscode-text>To visit <a href="https://console.groq.com/docs/rate-limits#rate-limits">rate limits</a>, <a href="https://console.groq.com/docs/models">models</a> for more information</vscode-text>
      <vscode-button style="margin-top:1rem" id="save" appearance="primary" onclick="save()">Save & Connect</vscode-button>
      <div class="success" id="success">✓ key saved — you're good to go</div>
    </div>
    <script>
      const vscode = acquireVsCodeApi()

      function save() {
        const key = document.getElementById('key').value.trim()
        if (!key) return
        const model = document.getElementById('model').value
        vscode.postMessage({ key, model })
        document.getElementById('save').textContent = 'Saved'
        document.getElementById('save').disabled = true
        document.getElementById('success').style.display = 'block'
      }
    </script>
    </body>
    </html>`
  )
}