import type { MetadataRoute } from 'next'

export function GET() {
  return Response.json(
    {
      name: 'Tonelix',
      start_url: '/tone',
      scope: '/tone',
      display: 'standalone',
      icons: [{ src: '/icon.png', sizes: '712x712', type: 'image/png' }],
    } satisfies MetadataRoute.Manifest,
    { headers: { 'Content-Type': 'application/manifest+json' } }
  )
}
