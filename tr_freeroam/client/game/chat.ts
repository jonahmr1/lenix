import { control } from "@trippler/tr_lib/client"
import { openChat } from "../modules/chat"

control.onDisabled('T', () => {
  openChat()
})