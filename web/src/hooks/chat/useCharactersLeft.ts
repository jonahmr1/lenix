import { maxTextLength } from '../../../../../tr_freeroam/shared/constants'

export default (inputLength: number) => {
  const characterLeftElement = document.getElementById('characters-left')!
  characterLeftElement.textContent = (maxTextLength - inputLength).toString()
  if (inputLength >= (maxTextLength) - maxTextLength / 4) {
    characterLeftElement.classList.remove('hidden')
  } else {
    characterLeftElement.classList.add('hidden')
  }
  if ((maxTextLength - inputLength) < 0) {
    characterLeftElement.classList.add('text-red-500')
    characterLeftElement.classList.remove('text-stone-200')
  } else {
    characterLeftElement.classList.remove('text-red-500')
    characterLeftElement.classList.add('text-stone-200')
  }
}