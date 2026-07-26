import { closeUI } from "../modules"

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeUI()
  }
})

document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})