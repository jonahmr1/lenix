import { totalLangsBytes } from './langs'
import { totalCommits } from './commits'
import { totalLinesAdded } from './loc'

if (!process.env.GH_TOKEN?.length) throw 'GH_TOKEN missing'

const loc = await totalLinesAdded()
const commits = await totalCommits()
const langsBytes = await totalLangsBytes()

const content = JSON.stringify({ loc, commits, langsBytes })

const res = await fetch(
	`https://gist.github.com/jonahmr1/8a81298c8173af0f2bff75bba7f37c68`,
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
