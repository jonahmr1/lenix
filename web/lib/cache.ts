import 'server-only'

import { asserts } from "@lenix/lenix";
import { cacheLife } from "next/cache";
import { createAnon } from './supabase';
import { fetchGithubStats } from './github';

const legal = async () => {
	'use cache'
	cacheLife('days')

	const supabase = createAnon()

	const { data, error } = await supabase
		.from('legal')
		.select('id, type, key, value, updated_at')

	asserts(!error, JSON.stringify(error))

	return data
}

const github = async () => {
	'use cache: remote'
	const hour = 60 * 60

	cacheLife({
		stale: 0,
		revalidate: 24 * hour,
		expire: 7 * 24 * hour,
	})

	const stats = await fetchGithubStats()
	return { ...stats, updated_at: new Date().toISOString() }
}

export const cache = {
	legal,
	github
}