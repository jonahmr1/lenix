declare global {
  const GetParentResourceName: () => string;
}

export { default as onNuiCallback } from './nuiCallback/onNuiCallback'
export { default as triggerNuiCallback } from './nuiCallback/triggerNuiCallback'
export { default as onPromise } from './promise/onPromise'
export * from './promise/triggerPromise'
export * from '../shared/console'