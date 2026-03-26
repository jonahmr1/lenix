#!/usr/bin/env node
const [, , cmd] = process.argv

switch (cmd) {
	case 'format':
		await import('./format/index')
		break
	case '--lint':
		await import('./lint/src/lint.mts')
		break
	default:
		process.stdout.write(
			'Usage: lenix <command>\n\nCommands:\n  format    Setup prettier\n  --lint    Setup eslint\n',
		)
		process.exit(0)
}
export {}
