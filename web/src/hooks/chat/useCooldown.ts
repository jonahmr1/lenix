import { setInCooldown } from "."

export default () => {
  const bar = document.getElementById('cooldown-bar')
  if (bar) {
    setInCooldown(true)
    bar.classList.remove('opacity-0')
    bar.classList.add('opacity-100')
    bar.style.transition = 'none'
    bar.style.width = '100%'
    
    setTimeout(() => {
      bar.style.transition = ''
      bar.style.width = '0%'
    }, 50)
  }
}