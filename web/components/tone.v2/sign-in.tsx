import Image from 'next/image'
import artwork from '@/app/tone/assets/sign-in-artwork.webp'
import { AuthControls } from './auth-controls'

export function SignIn({ initialMessage }: { initialMessage: string | null }) {
  return (
    <main className="not-typeset flex h-screen bg-background text-foreground portrait:flex-col-reverse">
      <section
        aria-label="Tonelix account"
        className="flex flex-1 items-center justify-center p-6"
      >
        <div className="w-full max-w-sm">
          <AuthControls account={null} initialMessage={initialMessage} />
        </div>
      </section>

      <div className="relative flex-1 overflow-hidden bg-neutral-950 text-white">
        <Image
          src={artwork}
          alt=""
          fill
          preload
          sizes="(orientation: portrait) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/40" />
        <p className="absolute top-7 right-6 text-3xl font-medium tracking-tight sm:right-10 lg:top-10">
          Tonelix
        </p>
        <p className="absolute right-10 bottom-10 text-3xl font-light tracking-tight text-white/90 lg:block xl:text-4xl">
          Find your rhythm.
        </p>
      </div>
    </main>
  )
}
