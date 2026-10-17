export { default } from '@/app/loading'
/* 

bun dev
$ next dev
▲ Next.js 16.3.4 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.100.202:3000
- Environments: .env.local
✓ Ready in 223ms
✓ Running next.config.ts took 64ms
[MDX] started dev server
- Cache Components enabled

 GET /tone/e41533d1-6ba1-4fe7-9685-efa35f1dab08 200 in 515ms (next.js: 129ms, generate-params: 204ms, application-code: 182ms)
Unhandled Rejection: Error: Route "/tone/[playlistId]": Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`.

This blocks prerendering because the value is only available at runtime.

Ways to fix this:
  - [stream] Wrap the component in `<Suspense fallback={...}>` so the hook value streams in after prerendering
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-client-hook
    at Page (app/tone/[playlistId]/page.tsx:18:25)
    at processTicksAndRejections (null)
  16 |
  17 | export default function Page() {
> 18 |  const { playlistId } = useParams<{ playlistId: string }>()
     |                        ^
  19 |  const { states, loading, setStates } = useStates()
  20 |  const [tracks, setTracks] = useState<YoutubeVideo[]>()
  21 | {
  digest: 'CLIENT_HOOK_DYNAMIC'
}
Unhandled Rejection: Error: Route "/tone/[playlistId]": Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`.

This blocks prerendering because the value is only available at runtime.

Ways to fix this:
  - [stream] Wrap the component in `<Suspense fallback={...}>` so the hook value streams in after prerendering
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-client-hook
    at processTicksAndRejections (null) {
  digest: 'CLIENT_HOOK_DYNAMIC'
}

*/