import { onNuiCallback } from "@trippler/tr_lib/nui"
import openEscapeMenu from "../components/spawn/escapeMenu"

onNuiCallback('spawn/openEscapeMenu', () => {
  openEscapeMenu()
})