export const trace = (...parameters: any): void => {
  console.trace(`^6`, ...parameters, '^0')
}

export const info = (...parameters: any): void => {
  console.info(`^5`, ...parameters, '^0')
}

export const fatal = (...parameters: any): void => {
  throw new Error(...parameters)
}