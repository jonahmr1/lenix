import { control, triggerNuiCallback } from "@trippler/tr_lib/client";

control.onDisabled('ESC', () => triggerNuiCallback('spawn/openEscapeMenu'))