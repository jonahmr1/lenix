import { toast } from 'sonner'
import { useEffect } from 'react'
import { useApp } from '@/app/tone/provider'
import { DrawerTitle } from '@/components/ui/drawer'
export function PocketMode() {
  const { state, setState } = useApp()
  useEffect(() => {
    let active = true
    let lock: WakeLockSentinel | undefined
    async function keepAwake() {
      if (document.visibilityState !== 'visible') return
      try {
        const next = await navigator.wakeLock.request('screen')
        if (active) lock = next
        else await next.release()
      } catch {
        if (active)
          toast.error('Screen wake lock unavailable. Your phone may auto-lock.')
      }
    }
    void keepAwake()
    document.addEventListener('visibilitychange', keepAwake)
    return () => {
      active = false
      document.removeEventListener('visibilitychange', keepAwake)
      void lock?.release()
    }
  }, [])
  useEffect(() => {
    if (state.pocketMode !== 'unlock') return
    const timer = window.setTimeout(
      () => setState(previous => ({ ...previous, pocketMode: 'locked' })),
      5000
    )
    return () => window.clearTimeout(timer)
  }, [state.pocketMode, setState])
  return (
    <div
      data-pocket-mode
      data-vaul-no-drag
      className='absolute inset-0 z-10 grid touch-none place-items-center bg-black text-white select-none'
    >
      <meta name='theme-color' content='#000000' />
      <DrawerTitle className='sr-only'>Pocket mode</DrawerTitle>
      {state.pocketMode === 'locked' ? (
        <button
          type='button'
          className='absolute inset-0 touch-none'
          aria-label='Double-tap to show unlock slider'
          onDoubleClick={() =>
            setState(previous => ({ ...previous, pocketMode: 'unlock' }))
          }
          onKeyDown={event => {
            if (event.key === 'Enter')
              setState(previous => ({ ...previous, pocketMode: 'unlock' }))
          }}
        />
      ) : (
        <label className='absolute bottom-1/4 grid w-2/3 max-w-72 gap-4 text-center'>
          Slide to unlock
          <input
            type='range'
            min='0'
            max='100'
            defaultValue='0'
            className='h-14 w-full touch-none appearance-none rounded-full bg-white/20 px-1.5 [&::-moz-range-thumb]:size-11 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
            onPointerDown={event => {
              const box = event.currentTarget.getBoundingClientRect()
              if (event.clientX - box.left > 56) event.preventDefault()
            }}
            onPointerUp={event => {
              const unlocked = Number(event.currentTarget.value) >= 98
              setState(previous => ({
                ...previous,
                pocketMode: unlocked ? null : 'locked',
              }))
            }}
            onKeyUp={event => {
              if (Number(event.currentTarget.value) === 100)
                setState(previous => ({ ...previous, pocketMode: null }))
            }}
          />
        </label>
      )}
    </div>
  )
}
