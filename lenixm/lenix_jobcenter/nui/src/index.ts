import './elements'
import './dom'
import './api'
import { closeUI, hideDashboard } from './modules'

document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.querySelector('.close-btn')
  if (closeBtn) {
    closeBtn.addEventListener('click', closeUI)
  }

  hideDashboard()
})

window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error)
})