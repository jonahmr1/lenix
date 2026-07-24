import { generateRawHTML, generateRawStyle } from "./dom"

generateRawHTML()
generateRawStyle()

const keyContent = document.getElementById('interact-key-content')
const textB = document.getElementById('interact-text-content-b')
const keyElement = document.getElementById('interact-key')

export const showHelper = (text: string,  key: string) => {
  const interactionApp = document.getElementById('interaction-app')

  if (textB) {
    textB.textContent = text
  }
  if (key && keyContent && keyElement) {
    keyContent.textContent = key
    keyElement.style.display = 'block'
  }

  if (interactionApp) {
    interactionApp.style.display = 'block'
    interactionApp.style.opacity = '0'
    setTimeout(() => {
      interactionApp.style.transition = 'opacity 0.4s'
      interactionApp.style.opacity = '1'
    }, 10)
  }
}

export const hideHelper = () => {
  const hideApp = document.getElementById('interaction-app')
  if (hideApp) {
    hideApp.style.transition = 'opacity 0.35s'
    hideApp.style.opacity = '0'
    setTimeout(() => {
      hideApp.style.display = 'none'
      if (!keyContent || !textB || !keyElement) return
      keyContent.textContent = ''
      textB.textContent = ''
      keyElement.style.display = 'none'
    }, 350)
  }
}