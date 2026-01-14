import { getState, setState } from "../../../states/freeroam"
import { input } from "../../../elements/freeroam/chat/input"

const isValidItem = (el: Element | null | undefined) => {
  if (!el) return false
  const html = el.innerHTML?.trim()
  return html && html !== `<i class="fas fa-trash"></i>`
}

const getNextValid = (el: Element | null | undefined): Element | null | undefined => {
  let current = el
  while (current && !isValidItem(current)) {
    current = current.nextElementSibling
  }
  return current
}

const getPrevValid = (el: Element | null | undefined): Element | null | undefined => {
  let current = el
  while (current && !isValidItem(current)) {
    current = current.previousElementSibling
  }
  return current
}

export const useCommandSelection = (direction: string) => {
  if (input.value.length === 0) return

  if (direction === 'down') {
    getState.currentItemSelected?.classList.remove('border', 'border-white')
    
    if (!getState.currentItemSelected) {
      const container = document.getElementById('chat-suggestions-items')
      setState.currentItemSelected(getNextValid(container?.firstElementChild))
    } else {
      setState.currentItemSelected(getNextValid(getState.currentItemSelected.nextElementSibling))
    }
    
    getState.currentItemSelected?.classList.add('border', 'border-white')
  } else if (direction === 'up') {
  getState.currentItemSelected?.classList.remove('border', 'border-white')
  
  if (!getState.currentItemSelected) {
    const container = document.getElementById('chat-suggestions-items')
    setState.currentItemSelected(getPrevValid(container?.lastElementChild))
  } else {
    const prev = getPrevValid(getState.currentItemSelected.previousElementSibling)
    if (!prev) {
      // Wrap to last valid element
      const container = document.getElementById('chat-suggestions-items')
      setState.currentItemSelected(getPrevValid(container?.lastElementChild))
    } else {
      setState.currentItemSelected(prev)
    }
  }
  
  getState.currentItemSelected?.classList.add('border', 'border-white')
}
}

export const useClearCommandSelection = () => {
  getState.currentItemSelected?.classList.remove('border', 'border-white')
  setState.currentItemSelected(null)
}