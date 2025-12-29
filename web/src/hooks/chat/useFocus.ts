import { inCooldown, messageCount, setFocus } from '../../../../../tr_freeroam/web/src'

export default () => {
  setFocus(true)
  const inputElement = document.querySelector('.input') as HTMLInputElement
  inputElement?.focus()
  const input = document.getElementById('input')
  const block = document.getElementById('block')?.classList
  const messages = document.getElementById('messages')?.classList
  const cooldown = document.getElementById('cooldown-bar')?.classList
  const charactersLeft = document.getElementById('characters-left')?.classList
  if (inCooldown) {
    cooldown?.remove('opacity-0')
  }
  input?.classList.add('opacity-100')
  input?.classList.remove('opacity-0')
  block?.add('blured-20')
  block?.add('shadow-md')
  block?.add('border')
  block?.add('bg-stone-900/80')
  charactersLeft?.add('opacity-100')
  charactersLeft?.remove('opacity-0')
  messages?.add('blured-20')
  ;(window as any).refreshBlurElements?.()

  for (let i = 1; i <= messageCount; i++) {
    const message = document.getElementById('message-' + i)?.classList
    message?.remove('duration-[5s]')
    message?.add('duration-[0s]')
    message?.add('opacity-100')
    message?.remove('opacity-0')
  }
}