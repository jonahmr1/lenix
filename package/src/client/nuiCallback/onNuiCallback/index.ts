export default <T = unknown>(
  callbackType: string, 
  Function: (data: T, callback: (returned: any) => void) => void
) => RegisterNuiCallback(callbackType, Function)