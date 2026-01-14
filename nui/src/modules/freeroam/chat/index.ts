import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { getArrayfiedPassedCharacters } from "../../../utils/chat"
import { changeBorderColor } from "./changeBorderColor"
import { trace } from "@trippler/tr_lib/shared"
import { Message, Suggestion } from "../../../../../shared/types/freeroam"
import { getState } from "../../../states/freeroam"
import { input } from "../../../elements/freeroam/chat/input"
import { resultsFound } from "./updateSuggetions"
import { hideChat } from "./toggles"
import { createNewMessage } from "../../../elements/freeroam/chat/messages"

export const addMessage = (message: Message) => {
  createNewMessage(message.args)
}

export const addSuggestion = (
  name: Suggestion['name'],
  help: Suggestion['help'],
  params: Suggestion['params']  
) => {
  getState.suggestions.push({ 
    name: name[0] !== `/` ? name : name.slice(1),
    help,
    params
  })
}

export const removeSuggestion = (name: Suggestion['name']) => {
  const filteredName = name[0] !== `/` ? name : name.slice(1)
  for (const [key, value] of getState.suggestions.entries()) {
    if (value.name === filteredName) {
      getState.suggestions.splice(key, 1)
      return
    }
  }
  trace(`tried to remove suggestion '${name}' but it was not found`)
}



export const acceptSuggetion = (suggestion: string | undefined) => {
  if (!suggestion || resultsFound < 1) return
  input.value = `/${suggestion}`
}

export const sendCommand = (raw: string) => {
  triggerNuiCallback<boolean>('chat/sendCommand', { command: getArrayfiedPassedCharacters(raw) })
  changeBorderColor()
  hideChat()
}

export const preventPlaceholderDuplication = (index: number) => {
  const element = document.getElementById(`chat-suggestion-item-${index}`)
  if (element) {
    element.innerHTML = ''
  }
}