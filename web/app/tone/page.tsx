import { MusicNotesIcon } from '@phosphor-icons/react/dist/ssr'

export default function TonePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-muted p-5">
        <MusicNotesIcon
          aria-hidden="true"
          className="size-8 text-muted-foreground"
        />
      </div>
      <h1 className="text-2xl font-medium tracking-tight">
        Your space for music
      </h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        Choose a playlist or create one to get started.
      </p>
    </div>
  )
}
