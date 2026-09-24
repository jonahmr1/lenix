import { fetchGithubStats } from "@/lib/github"
import { supabaseUrl } from "@/lib/supabase"
import { Database } from "@/lib/supabase.types"
import { asserts } from "@lenix/lenix"
import { createClient } from "@supabase/supabase-js"
import { revalidateTag } from "next/cache"

export async function GET(request: Request) {
	const secret = process.env.CRON_SECRET

	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return new Response('Unauthorized', { status: 401 })
	}

	const key = process.env.SUPABASE_SECRET_KEY
	asserts(supabaseUrl && key, 'Supabase credentials missing')

	const supabase = createClient<Database>(supabaseUrl, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	})

	const stats = await fetchGithubStats()
	const updated_at = new Date().toISOString()

	const { error } = await supabase.from('stats').upsert(
		{ id: 1, data: stats, updated_at },
		{ onConflict: 'id' },
	)

	if (error) throw error

	revalidateTag('github-stats', 'max')

	return Response.json({ ok: true, updated_at })
}
