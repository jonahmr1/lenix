import 'server-only'

import { asserts } from '@lenix/lenix'
import { cacheLife } from 'next/cache'
import { createAnon } from './supabase'
import { fetchGithubStats } from './github'

const TEMPORARY = {
	lines: {
		added: 1369848,
		removed: 1262410,
	},
	langs: [
		{
			name: 'TypeScript',
			bytes: 719546,
		},
		{
			name: 'Lua',
			bytes: 129364,
		},
		{
			name: 'MDX',
			bytes: 43734,
		},
		{
			name: 'Rust',
			bytes: 42105,
		},
		{
			name: 'CSS',
			bytes: 30326,
		},
		{
			name: 'JavaScript',
			bytes: 9553,
		},
		{
			name: 'C++',
			bytes: 8991,
		},
		{
			name: 'Python',
			bytes: 7972,
		},
		{
			name: 'PLpgSQL',
			bytes: 5926,
		},
		{
			name: 'HTML',
			bytes: 4139,
		},
		{
			name: 'Swift',
			bytes: 3031,
		},
		{
			name: 'C#',
			bytes: 2306,
		},
		{
			name: 'Shell',
			bytes: 1977,
		},
		{
			name: 'Batchfile',
			bytes: 344,
		},
		{
			name: 'Makefile',
			bytes: 171,
		},
		{
			name: 'C',
			bytes: 67,
		},
	],
}

const legal = async () => {
	'use cache'
	cacheLife('days')

	const supabase = createAnon()

	const { data, error } = await supabase.from('legal').select('id, type, key, value, updated_at')

	asserts(!error, JSON.stringify(error))

	return data
}

const journey = async () => {
	'use cache'
	cacheLife('days')

	const supabase = createAnon()

	const { data, error } = await supabase.from('journey').select('*')

	asserts(!error, JSON.stringify(error))

	return data
}

const github = async () => {
	'use cache'
	cacheLife('days')

	const stats = TEMPORARY
	return { ...stats, updated_at: new Date().toISOString() }
}

export const cache = {
	legal,
	github,
	journey,
}
