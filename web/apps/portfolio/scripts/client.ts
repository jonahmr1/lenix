import { Octokit } from '@octokit/rest'

export const octokit = new Octokit({ auth: process.env.GH_TOKEN })
export const ownerRepos = await octokit.paginate(
	octokit.rest.repos.listForAuthenticatedUser,
	{ per_page: 100, type: 'all' },
)
export const VALID_NAMES = [
	'Lenix',
	'lenixdev',
	'LenixDev',
	'Lenixx',
	'tripplerscripts',
	'lenix',
	'TripplerScripts',
	'LenixStudio',
	'lehnihx',
	'jonahmr1'
]
