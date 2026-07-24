export default <T = unknown>(
  enpoint: string, 
  callback: (data: T, callback: (returned: any) => void) => void
) => RegisterNuiCallback(enpoint, callback)