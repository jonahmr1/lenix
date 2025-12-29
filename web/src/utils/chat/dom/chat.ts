import useUnfocus from "../../hooks/useUnfocus"

const block = document.getElementById('block')

document.addEventListener('mousedown', (e) => {
  if (block && !block.contains(e.target as Node)) {
    useUnfocus()
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    useUnfocus()
  }
})