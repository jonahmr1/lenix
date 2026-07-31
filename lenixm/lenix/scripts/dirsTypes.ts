import { mkdirSync, readdirSync, writeFileSync } from "fs"

function folders(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)
		.sort()
}

function union(names: string[]): string {
	return names.map(name => `'${name}'`).join(' | ') || 'never'
}

export function genDirsTypes() {
	const client = folders('resource/client')
	const server = folders('resource/server')
	const common = folders('resource/common')
	const scripts = [...new Set([...client, ...server, ...common])].sort()

	mkdirSync('resource/generated', { recursive: true })

	writeFileSync(
		'types/dirs.d.ts',
		[
			'/* auto-generated */',
			'',
			`export type ClientScript = ${union(client)}`,
			`export type ServerScript = ${union(server)}`,
			`export type CommonScript = ${union(common)}`,
			`export type Script = ${union(scripts)}`,
			'',
		].join('\n'),
		'utf8',
	)
}