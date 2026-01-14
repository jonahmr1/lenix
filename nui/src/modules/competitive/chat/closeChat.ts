import { nuiFocus } from '@trippler/tr_lib/nui'
import { getState, setState } from '../../states'

export default () => {
  setState.focused(true)
  const input = document.getElementById('input')?.classList
  const block = document.getElementById('block')?.classList
  const messages = document.getElementById('messages')?.classList
  const cooldown = document.getElementById('cooldown-bar')?.classList
  const charactersLeft = document.getElementById('characters-left')?.classList
  cooldown?.add('opacity-0')
  cooldown?.remove('opacity-100')
  input?.add('opacity-0')
  input?.remove('opacity-100')
  block?.remove('blured-20')
  block?.remove('shadow-md')
  block?.remove('border')
  block?.remove('bg-stone-900/80')
  charactersLeft?.add('opacity-0')
  charactersLeft?.remove('opacity-100')
  messages?.remove('blured-20')
  ;(window as any).refreshBlurElements?.()

  const inputElement = document.querySelector('.input') as HTMLInputElement
  inputElement?.blur()
  for (let i = 1; i <= getState.messageCount; i++) {
    const message = document.getElementById('message-' + i)?.classList
    if (getState.pendingMessageForFadeCount.includes(i)) {
      message?.add('duration-[5s]')
      message?.add('opacity-100')
      message?.remove('opacity-0')
    } else {
      message?.add('duration-[5s]')
      message?.remove('opacity-100')
      message?.add('opacity-0')
    }
  }
  nuiFocus(false, false)
}