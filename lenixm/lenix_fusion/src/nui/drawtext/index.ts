import { generateRawHTML, generateRawStyle } from "./dom"

generateRawHTML()
generateRawStyle()

const container = document.getElementById('container')
const iconText = document.querySelector('.icon-text')
const textElement = document.querySelector('.text')
const audio = document.getElementsByTagName('audio')[0]
const iconElement = document.querySelector('.icon') as HTMLDivElement
const keyElement = document.querySelector('.key') as HTMLDivElement
const keyText = document.querySelector('.key-text')

const playAudio = () => {
  if (audio) {
    audio.volume = 1.0
    audio.play().catch(() => { })
  }
}

export const initDrawtext = (color: string) => {
  document.documentElement.style.setProperty('--primary-color', color)
}

export const showtDrawtext = (text: string, icon: string | false, key: string) => {
  playAudio()
  if (textElement) {
    textElement.textContent = text
  }

  if (iconElement) {
    if (icon && iconText) {
      iconText.innerHTML = `<i class="${icon}"></i>`
      iconElement.style.display = 'flex'
    } else {
      if (icon == false) {
        iconElement.style.display = 'none'
      } else {
        iconText ? iconText.innerHTML = `<i class="fas fa-bells"></i>` : null
        iconElement.style.display = 'flex'
      }
    }
  }

  if (keyElement) {
    if (key && keyText) {
      keyText.textContent = key
      keyElement.style.display = 'flex'
    } else {
      keyElement.style.display = 'none'
    }
  } 

  if (container) {
    container.style.display = 'flex'
    container.classList.remove('slide-out')
    container.classList.add('container')
  }
}

export const hideDrawtext = () => {
  playAudio()
  if (container) {
    container.classList.remove('container')
    container.classList.add('slide-out')
    setTimeout(() => {
      container.style.display = 'none'
    }, 500)
  }
}