import { fatal } from '@trippler/tr_lib/client'

export const isValidCoords = (coords: number[] | object) => {
  if (Array.isArray(coords) && coords.length === 4) 
  return true
  else return false
}

export const validateInputs = (coords: [number, number, number, number], hash: number) => {
  if (typeof hash !== 'number') {
    fatal(`Expecter a number of hash, got ${typeof hash}(${hash})`)
    return
  }
  if (!isValidCoords(coords)) {
    fatal(`expected array of number with length of 4, got ${typeof coords}(${coords})`)
    return
  }
  return true
}