import { cache } from "@/lib/cache"

export async function GET(request: Request) {
	const secret = process.env.CRON_SECRET

	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return new Response('Unauthorized', { status: 401 })
	}
	await cache.github()

  return Response.json({ ok: true })
}
