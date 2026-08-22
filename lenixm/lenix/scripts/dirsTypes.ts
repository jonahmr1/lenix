import { existsSync, readdirSync, writeFileSync } from 'fs'

function folders(dir: string): string[] {
	if (!existsSync(dir)) return []

	return readdirSync(dir, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)
		.sort()
}

function files(dir: string, extension: string): string[] {
	if (!existsSync(dir)) return []

	return readdirSync(dir, { withFileTypes: true })
		.filter(entry => entry.isFile() && entry.name.endsWith(extension))
		.map(entry => entry.name.slice(0, -extension.length))
		.sort()
}

function union(names: string[]): string {
	return names.map(name => `\n  | '${name}'`).join('') || 'never'
}

export function genDirsTypes() {
	const client = folders('resource/client')
	const server = folders('resource/server')
	const web = files('web/src/apps', '.tsx')

	writeFileSync(
		'types/dirs.d.ts',
		[
			'/* auto-generated */',
			'',
			`export type ClientScript = ${union(client)}`,
			`export type ServerScript = ${union(server)}`,
			`export type WebScript = ${union(web)}`,
			'',
		].join('\n'),
		'utf8',
	)
}
