export const trace = (...parameters: any): void => {
  console.trace(...parameters)
}

export const info = (...parameters: any): void => {
  console.info(...parameters)
}

export const fatal = (...parameters: any): void => {
  console.error(...parameters)
}