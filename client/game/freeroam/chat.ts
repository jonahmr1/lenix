import { control } from "@trippler/tr_lib/client"
import { openChat } from "../../modules/freeroam/chat"

control.onDisabled('T', openChat)