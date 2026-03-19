import * as vscode from 'vscode';

export const setup = (context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    'lenixSetup',
    'Lenix Setup',
    vscode.ViewColumn.One,
    { enableScripts: true, localResourceRoots: [context.extensionUri] }
  )

  panel.webview.html = getWebviewContent(panel.webview, context.extensionUri)

  panel.webview.onDidReceiveMessage(async msg => {
    await vscode.workspace.getConfiguration('lenix').update('apiKey', msg.key, true)
    vscode.window.showInformationMessage('API key saved!')
    panel.dispose()
  })
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
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
      <p class="subtitle">Free tier · 14k requests/day · no credit card</p>
      <ol class="steps">
        <li><span class="step-num">01</span><span>Go to <a href="https://console.groq.com/keys">console.groq.com/keys</a></span></li>
        <li><span class="step-num">02</span><span>Sign up for a free account</span></li>
        <li><span class="step-num">03</span><span>Click <strong>Create API Key</strong></span></li>
        <li><span class="step-num">04</span><span>Paste your key below</span></li>
      </ol>
      <vscode-text-field id="key" type="password" placeholder="gsk_...">API Key</vscode-text-field>
      <vscode-button id="save" appearance="primary" onclick="save()">Save & Connect</vscode-button>
      <div class="success" id="success">✓ key saved — you're good to go</div>
    </div>
    <script>
      const vscode = acquireVsCodeApi()

      function save() {
        const field = document.getElementById('key')
        const key = field.value.trim()
        if (!key) return
        vscode.postMessage({ key })
        document.getElementById('save').textContent = 'Saved'
        document.getElementById('save').disabled = true
        document.getElementById('success').style.display = 'block'
      }
    </script>
    </body>
    </html>`
  )
}