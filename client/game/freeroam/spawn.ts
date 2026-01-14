import { control } from "@trippler/tr_lib/client";
import { openEscapeMenu } from "../../nui/freeroam/spawn";

control.onDisabled('ESC', () => {
  openEscapeMenu()
})