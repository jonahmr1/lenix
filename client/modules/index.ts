import { fatal, trace } from "@trippler/tr_lib/shared"

export const everyScalar = (
  coords: [number, number, number, number] | (number | undefined)[] | false,
  debug?: boolean
): number[] | false => {
  if (!Array.isArray(coords)) return fatal`expected array of numbers, got ${coords}`
  if (coords.length === 4) {
    if (coords.every(scalar => { return typeof scalar === 'number' })) {
      return coords as number[]
    } else {
      debug && trace(`expected array of numbers only, got ${coords}`)
      return false
    }
  } else {
    debug && trace(`expected array of length 4, got ${coords}`)
    return false
  }
}