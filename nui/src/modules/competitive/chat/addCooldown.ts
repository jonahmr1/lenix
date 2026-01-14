import { setState } from "../../../states/competitive"

export default () => {
  const bar = document.getElementById('cooldown-bar')
  if (bar) {
    setState.inCooldown(true)
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