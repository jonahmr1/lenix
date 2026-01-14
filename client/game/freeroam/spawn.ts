import { control } from "@trippler/tr_lib/client";
import { openEscapeMenu } from "../nui/spawn";

control.onDisabled('ESC', () => {
  openEscapeMenu()
})