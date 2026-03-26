import { intro, outro, confirm, log, spinner } from '@clack/prompts'
import { execSync } from 'child_process'
import fs from 'fs'

intro('Prettier Setup')

const install = await confirm({ message: 'Install prettier + eslint-config-prettier(to prevent conflicts)?' })
if (install) {
  const s = spinner()
  s.start('Installing...')
  execSync('pnpm add --save-dev --save-exact prettier eslint-config-prettier', { stdio: 'pipe' })
  s.stop('Installed')
}

const rc = await confirm({ message: 'Create .prettierrc?' })
if (rc) {
  fs.writeFileSync('.prettierrc', '{}\n')
  log.success('Created .prettierrc')
}

const ignore = await confirm({ message: 'Create .prettierignore?' })
if (ignore) {
  fs.writeFileSync('.prettierignore', '# Ignore artifacts:\nbuild\ncoverage\n')
  log.success('Created .prettierignore')
}

log.warn('Manual — copy paste the import below and add "prettier" to the `end` of your ESLint extends')
log.info("import prettier from 'eslint-config-prettier'")
await confirm({ message: 'Done?' })

log.warn('Manual — add to .vscode/settings.json:\n  "editor.formatOnSave": true\n  "editor.defaultFormatter": "esbenp.prettier-vscode"')
await confirm({ message: 'Done?' })

log.warn('Manual — add to .vscode/extensions.json (inside "recommendations" array):\n  "recommendations": ["esbenp.prettier-vscode"]')
await confirm({ message: 'Done?' })

const format = await confirm({ message: 'Run prettier on existing files now to test it out?' })
if (format) {
  const s = spinner()
  s.start('Formatting...')
  execSync('pnpm exec prettier . --write', { stdio: 'pipe' })
  s.stop('Formatted')
}

outro('Prettier setup complete!')