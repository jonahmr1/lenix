export default <T = unknown>(
  callbackType: string, 
  Function: (data: T, callback: Function) => void
) => RegisterNuiCallback(callbackType, Function)