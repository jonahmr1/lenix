import { modulesEnabled } from "../../../shared/constants"

let modules: any = {}

;(async () => {
  if (modulesEnabled.chat) {
    modules.nuiFocus = (await import("@trippler/tr_lib/nui")).nuiFocus
    modules.input = (await import("../elements/chat/input")).input
    modules.hideChat = (await import("../modules/chat/toggles")).hideChat
    modules.acceptSuggetion = (await import("../modules/chat")).acceptSuggetion
    modules.useCommandSelection = (await import("../modules/chat/commandSelection")).useCommandSelection
    modules.currentItemSelected = (await import("../states")).getState.currentItemSelected
    modules.closestRelative = (await import("../modules/chat/updateSuggetions")).closestRelative
  }
  if (modulesEnabled.spawn) {
    modules.escapeMenu = (await import("../components/spawn/escapeMenu")).default
  }

  let enteredSelections = false

  document.addEventListener('keydown', (event) => {
    if (modulesEnabled.chat) {
      if (document.activeElement === modules.input) {
        switch (event.key) {
          case 'Tab':
            event.preventDefault()
            if (enteredSelections) {
              modules.acceptSuggetion(modules.currentItemSelected?.firstElementChild?.firstElementChild?.innerHTML?.slice(1))
            } else {
              modules.acceptSuggetion(modules.closestRelative)
            }
          break
          case 'ArrowUp':
            enteredSelections = true
            modules.useCommandSelection('up')
          break
          case 'ArrowDown':
            enteredSelections = true
            modules.useCommandSelection('down')
          break
          case 'Escape':
            enteredSelections = false
            modules.hideChat()
          break
          case 'F11':
            modules.nuiFocus(true, true)
          break
        }
      }
    }
    if (modulesEnabled.spawn) {
      if (document.activeElement !== modules.input) {
        switch (event.key) {
          case 'Escape':
            modules.escapeMenu()
          break
        }
      }
    }
  })
})()