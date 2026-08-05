import { totalLangsBytes } from './langs'
import { totalCommits } from './commits'
import { totalLinesAdded } from './loc'
import { octokit } from './client'

if (!process.env.GH_TOKEN?.length) throw 'GH_TOKEN missing'

const loc = await totalLinesAdded()
const commits = await totalCommits()
const langsBytes = await totalLangsBytes()

const content = JSON.stringify({ loc, commits, langsBytes })

const re = await octokit.rest.gists.update({
	gist_id: '8a81298c8173af0f2bff75bba7f37c68',
	files: {
		'data.json': {
			content,
		},
	},
})

if (re.status !== 200) throw `Failed to update the gist`

console.info('Gist updated.')
