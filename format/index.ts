import { intro, outro, confirm, log, spinner } from 'npm:@clack/prompts'
import { execSync } from 'node:child_process'
import fs from 'node:fs'

intro('Prettier Setup')

const install = await confirm({
	message:
		'Install prettier + eslint-config-prettier(to prevent conflicts)? (see https://prettier.io/docs/install)',
})
if (install === true) {
	const span = spinner()
	span.start('Installing...')
	execSync('pnpm add --save-dev --save-exact prettier eslint-config-prettier', {
		stdio: 'pipe',
	})
	span.stop('Installed')
}

const prompt = await confirm({ message: 'Create .prettierrc with a preset?' })
if (prompt === true) {
	const preset = await import('./preset.json').then(file =>
		JSON.stringify(file.default, null, 2),
	)
	fs.writeFileSync('.prettierrc', `${preset}\n`)
	log.success('Created .prettierrc with a preset')
}

const ignore = await confirm({
	message: 'Create .prettierignore? (see https://prettier.io/docs/ignore)',
})
if (ignore === true) {
	fs.writeFileSync('.prettierignore', '# Ignore artifacts:\nbuild\ncoverage\n')
	log.success('Created .prettierignore')
}

log.warn(
	'Manual (optional) — copy paste the import below and add "prettier" to the `end` of your ESLint extends',
)
log.info("---> import prettier from 'eslint-config-prettier' <---")
await confirm({ message: 'Done?' })

log.warn(
	'Manual — add to .vscode/settings.json:\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode"',
)
await confirm({ message: 'Done?' })

log.warn(
	'Manual (optional) — add to .vscode/extensions.json (inside "recommendations" array):\n  "esbenp.prettier-vscode"',
)
log.info('like: "recommendations": ["esbenp.prettier-vscode"]')
await confirm({ message: 'Done?' })

log.warn(
	'Manual (optional) - add the following script into your package.json\'s scripts object : "format": "pnpm exec prettier . --write",',
)
await confirm({ message: 'Done?' })

const format = await confirm({
	message: 'Run prettier on existing files now to test it out?',
})
if (format === true) {
	const span = spinner()
	span.start('Formatting...')
	execSync('pnpm exec prettier . --write', { stdio: 'pipe' })
	span.stop('Formatted')
}

outro('Prettier setup complete!')
