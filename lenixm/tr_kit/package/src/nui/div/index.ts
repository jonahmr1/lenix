interface ElementOptions {
  parent: string
  id?: string
  style?: string
  content?: string
}

export default ({ parent, id, style, content}: ElementOptions): typeof element => {
  const element = document.createElement('div')
  
  if (id) element.id = id
  if (style) element.className = style
  if (content) element.innerHTML = content

  const parentElement = document.getElementById(parent) || document.querySelector(`.${parent}`)

  if (!parentElement) {
    console.error(`Parent '${parent}' not found`)
    return element
  }

  parentElement.appendChild(element)
  return element
}