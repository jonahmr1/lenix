import { onNuiCallback } from "@trippler/tr_lib/nui"
import openEscapeMenu from "../../components/freeroam/spawn/escapeMenu"

onNuiCallback('spawn/openEscapeMenu', () => {
  openEscapeMenu()
})