import { onNuiCallback, onDOMLoaded } from "@trippler/tr_lib/client"
import { addSuggestions } from "../../modules/freeroam/chat"
import { earlySuggestionsInsertion, setDOMLoaded } from "../../../tr_freeroam/client"

onNuiCallback<{ command: string[] }>('chat/sendCommand', (data, callback) => {
  ExecuteCommand(data.command.join(' '))
  callback(true)
})

onDOMLoaded(() => {
  setDOMLoaded(true)
  addSuggestions(earlySuggestionsInsertion)
})