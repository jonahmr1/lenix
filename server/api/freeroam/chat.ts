import { fatal, trace } from "@trippler/tr_lib/shared"

const addMessage = (target: number, message: string) => {
  if (typeof target !== 'number') {
    trace(`expected number at #1, got ${typeof target}`)
    target = -1
  }
  if (typeof message !== 'string') {
    fatal(`expected string at #2, got ${typeof message}`)
    return
  }

  emitNet('chat:addMessage', target, message)
}

const addSuggestion = (target: number, name: string, help: string, params: string[]) => {
  if (typeof target !== 'number') {
    trace(`expected number at #1, got ${typeof target}`)
    target = -1
  }

  emitNet('chat:addSuggestion', target, name, help, params)
}

const addSuggestions = (target: number, suggestions: string[]) => {
  if (typeof target !== 'number') {
    trace(`expected number at #1, got ${typeof target}`)
    target = -1
  }
  if (!Array.isArray(suggestions)) {
    fatal(`expected array at #2, got ${typeof suggestions}`)
    return
  }

  emitNet('chat:addSuggestions', target, suggestions)
}

const removeSuggestion = (target: number, name: string) => {
  if (typeof target !== 'number') {
    trace(`expected number at #1, got ${typeof target}`)
    target = -1
  }
  if (typeof name !== 'string') {
    fatal(`expected string at #2, got ${typeof name}`)
    return
  }
  
  emitNet('chat:removeSuggestion', target, name)
}

onNet('chat:addMessage', addMessage)
onNet('chat:addSuggestion', addSuggestion)
onNet('chat:addSuggestions', addSuggestions)
onNet('chat:removeSuggestion', removeSuggestion)

globalThis.exports('addMessage', addMessage)
globalThis.exports('addSuggestion', addSuggestion)
globalThis.exports('addSuggestions', addSuggestions)
globalThis.exports('removeSuggestion', removeSuggestion)