declare function RegisterNuiCallback<T = any>(
  callbackType: string, 
  callback: (data: T, callback: Function) => void
): void
export default () => RegisterNuiCallback