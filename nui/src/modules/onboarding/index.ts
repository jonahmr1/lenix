import { nuiFocus } from "@trippler/tr_lib/nui"
import { triggerNuiCallback } from "@trippler/tr_lib/nui"

export const toggleMenu = (state: boolean = true) => {
  nuiFocus(state, state)
  const menu = document.getElementById('main-menu')?.classList
  state ? menu?.remove('hidden') : menu?.add('hidden')
}

export const selectMode = async (mode: string) => triggerNuiCallback<boolean>('onboarding/selectMode', { mode })