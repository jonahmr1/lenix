declare function RegisterNuiCallback<T = any>(
  callbackType: string, 
  callback: (data: T, callback: Function) => void
): void
declare const GetParentResourceName: () => string