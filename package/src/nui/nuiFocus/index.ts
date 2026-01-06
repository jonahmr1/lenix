import triggerNuiCallback from "../triggerNuiCallback"

export default (keyboard: boolean = true, cursor: boolean = true) => triggerNuiCallback('__nuiFocus', [keyboard, cursor])