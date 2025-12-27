interface ElementOptions {
  parent: string
  id?: string
  className?: string
  content?: string
}

export default ({ parent, id, className, content}: ElementOptions): typeof element => {
  const element = document.createElement('div')
  
  if (id) element.id = id
  if (className) element.className = className
  if (content) element.innerHTML = content

  const parentElement = document.getElementById(parent) || document.querySelector(`.${parent}`)

  if (!parentElement) {
    console.error(`Parent '${parent}' not found`)
    return element
  }

  parentElement.appendChild(element)
  return element
}