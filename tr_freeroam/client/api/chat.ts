import { addMessage, addSuggestion, addSuggestions, removeSuggestion } from "../modules/chat"

on(`__cfx_export_chat_addMessage`, (cb: Function) => {
  cb(addMessage)
})

onNet('chat:addMessage', addMessage)
onNet('chat:addSuggestion', addSuggestion)
onNet('chat:addSuggestions', addSuggestions)
onNet('chat:removeSuggestion', removeSuggestion)

globalThis.exports('addMessage', addMessage)
globalThis.exports('addSuggestion', addSuggestion)
globalThis.exports('addSuggestions', addSuggestions)
globalThis.exports('removeSuggestion', removeSuggestion)