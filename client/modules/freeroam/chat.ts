import { triggerNuiCallback } from "@trippler/tr_lib/client"
import { fatal, info } from '@trippler/tr_lib/shared'
import { Message, Suggestion } from '../../../shared/types/freeroam'
import { isIterable } from "../../../tr_freeroam/client/utils"
import { DOMLoaded, earlySuggestionsInsertion } from "../../../tr_freeroam/client"

export const openChat = () => {
  if (globalThis.exports.tr_onboarding.modeSelected() !== 'freeroam') return 
  triggerNuiCallback('chat/openChat')
}

export const addMessage = (message: Message) => {
  if (typeof message !== 'object') fatal(`expected object at #2, got ${typeof message}`)
  if (message.template) return info(`template messages are not supported, the caller: '${GetInvokingResource()}'`)

  triggerNuiCallback('chat/message', message)
}

export const addSuggestion = (name: Suggestion['name'], help: Suggestion['help'], params: Suggestion['params']) => {
  if (typeof name !== 'string') {
    fatal(`expected string at #2, got ${typeof name}`)
    return
  }

  if (isIterable(params)) {
    let optionalFound = false
    for (const param of params) {
      if (param.optional) {
        optionalFound = true
      } else if (optionalFound) fatal(`A required parameter cannot be after an optional parameter`)
    }
  }
  if (!DOMLoaded) {
    earlySuggestionsInsertion.push({name, help, params})
  }

  triggerNuiCallback('chat/addSuggestion', name, help, params)
}

export const addSuggestions = (suggestions: Suggestion[]) => {
  if (!Array.isArray(suggestions)) {
    fatal(`expected array at #2, got ${typeof suggestions}`)
    return
  }

  for (let i = 0; i < suggestions.length; i++) {
    addSuggestion(suggestions[i]?.name, suggestions[i]?.help, suggestions[i]?.params)
  }
}

export const removeSuggestion = (name: string) => {
  if (typeof name !== 'string') {
    fatal(`expected string at #2, got ${typeof name}`)
    return
  }

  triggerNuiCallback('chat/removeSuggestion', name)
}