import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PlaylistNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-medium">Playlist unavailable</h1>
      <p className="text-sm text-muted-foreground">
        This playlist doesn’t exist or isn’t available to your account.
      </p>
      <Button asChild variant="outline" className="h-10">
        <Link href="/tone">Back to library</Link>
      </Button>
    </div>
  )
}
