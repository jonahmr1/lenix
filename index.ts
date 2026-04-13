#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write
const [, , cmd] = Deno.args

switch (cmd) {
	case 'format':
		await import('./format/index')
		break
	default:
		console.log(
			'Usage: lenix <command>\n\nCommands:\n  format    Setup prettier\n',
		)
		Deno.exit(0)
}
export {}
