import { writeFile } from 'fs/promises'
type FileContent = Parameters<typeof writeFile>[1]

const fxmanifest = Object.entries((await import('./fxmanifest.json')).default)

const generateContent = () => {
  let defaultContent: FileContent = ''
  for (const [key, value] of fxmanifest) {
    if (Array.isArray(value)) {
      defaultContent +=
`${key} {
  "${value}",
}
`
    } else if (typeof value === 'string') {
      defaultContent +=
`${key} "${value}"
`
    } else throw new Error('Invalid value type')
  }
  return defaultContent
}

const createFxmanifest = async (content?: FileContent) => await writeFile('fxmanifest.lua', content || generateContent())

export { createFxmanifest }