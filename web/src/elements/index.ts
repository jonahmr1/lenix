import createNewMessage from "../components/createNewMessage"

window.addEventListener('message', (event) => {
  if (event.data.action === 'createNewMessage') {
    createNewMessage(event.data.message)
  }
})

(() => {
  const root = document.useDiv("div")
  root.id = 'root'
  root.className = 'select-none hidden'
  document.body.appendChild(root)
})()