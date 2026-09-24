import 'server-only'

import { asserts } from '@lenix/lenix'
import { cacheLife, cacheTag } from 'next/cache'
import { createAnon } from './supabase'
import { fetchGithubStats } from './github'

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
	cacheTag('github-stats')

	const supabase = createAnon()
	const { data, error } = await supabase
		.from('stats')
		.select('data, updated_at')
		.eq('id', 1)
    .single()
		.overrideTypes<{
			data: Awaited<ReturnType<typeof fetchGithubStats>>
		}>()

	asserts(!error, JSON.stringify(error))

	return data
}

export const cache = {
	legal,
	github,
	journey,
}
