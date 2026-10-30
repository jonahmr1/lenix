import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Tonelix',
  description: 'Your music, at your pace.',
}

export default function TonelixPage() {
  return (
    <main className="not-typeset flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
      <section className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 text-card-foreground">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tonelix</h1>
          <p className="text-sm text-muted-foreground">
            Your music, at your pace.
          </p>
        </div>
        <Button
          disabled
          className="w-full"
          aria-describedby="tonelix-preview-note"
        >
          Continue with Google
        </Button>
        <p id="tonelix-preview-note" className="text-sm text-muted-foreground">
          Preview only. Sign-in and listening aren’t available yet.
        </p>
      </section>
    </main>
  )
}
