import triggerNuiCallback from "../triggerNuiCallback"

export default (keyboard: boolean, cursor: boolean) => triggerNuiCallback('__nuiFocus', [keyboard, cursor])