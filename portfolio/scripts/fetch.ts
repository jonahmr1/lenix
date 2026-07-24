import { totalLangsBytes } from './langs'
import { totalCommits } from './commits'
import { totalLinesAdded } from './loc'

if (typeof process.env.GH_TOKEN !== 'string')
	throw new Error('GH_TOKEN missing')
if (typeof process.env.VITE_GIST_ID !== 'string') throw new Error('VITE_GIST_ID missing')

const loc = await totalLinesAdded()
const commits = await totalCommits()
const langsBytes = await totalLangsBytes()

const content = JSON.stringify({ loc, commits, langsBytes })

const res = await fetch(
	`https://api.github.com/gists/${process.env.VITE_GIST_ID}`,
	{
		method: 'PATCH',
		headers: {
			Authorization: `token ${process.env.GH_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			files: { 'data.json': { content } },
		}),
	},
)

if (!res.ok)
	throw new Error(`Gist PATCH failed: ${res.status} ${await res.text()}`)
console.info('Gist updated.')
