import { cache } from "@/lib/cache"
import { asserts } from "@lenix/lenix"

export async function GET(request: Request) {
	const secret = process.env.CRON_SECRET
	asserts(secret, `Missing CRON_SECRET env var`)

	if (request.headers.get('authorization') !== `Bearer ${secret}`) {
		return new Response('Unauthorized', { status: 401 })
	}
	await cache.github()
	
  return Response.json({ ok: true })
}
