import useDiv from '../div/index'

interface ButtonConfig {
  parent: string
  content?: string
  id?: string
  style?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
  type?: 'primary' | 'secondary' | 'soft' | 'none'
  disableKey?: boolean
  onClick?: (disable: () => void) => void
  onHover?: () => void
}

const getSize = (size: ButtonConfig['size']): string => {
  const sizes = {
    'xs': 'text-xs py-1 px-4',
    'sm': 'text-sm py-1 px-4',
    'base': 'text-base py-1 px-4',
    'lg': 'text-lg py-1 px-5',
    'xl': 'text-xl py-1 px-6',
    '2xl': 'text-2xl py-2 px-6',
    '3xl': 'text-3xl py-2 px-8',
    '4xl': 'text-4xl py-3 px-10',
    '5xl': 'text-5xl py-3 px-12',
    '6xl': 'text-6xl py-4 px-14',
    '7xl': 'text-7xl py-5 px-16',
    '8xl': 'text-8xl py-6 px-20',
    '9xl': 'text-9xl py-6 px-20'
  }
  return sizes[size!]
}

const getType = (type: ButtonConfig['type'], size: ButtonConfig['size']): string | undefined => {
  const sizeClass = getSize(size!)
  const baseClasses = `${sizeClass} w-fit h-fit font-semibold rounded cursor-default transition-all whitespace-nowrap`
  
  switch(type) {
    case 'primary':
      return `${baseClasses} text-white bg-blue-700 hover:bg-blue-600`
    case 'secondary':
      return `${baseClasses} text-white bg-neutral-700 border border-stone-600 hover:bg-stone-600/90`
    case 'soft':
      return `${baseClasses} text-blue-500 bg-blue-950/70 hover:bg-blue-900/50`
    case 'none':
      return ''
  }
}

export default ({ parent, content, id, style, type, size, disableKey, onClick, onHover }: ButtonConfig): typeof button => {
  const parentElement = document.getElementById(parent) || document.querySelector(`.${parent}`)
  if (!parentElement) {
    throw new Error(`Parent element "${parent}" not found`)
  }

  const button = useDiv({parent: parent, id: id, style: style, content: content})
  button.className = getType(type, size) != undefined ? getType(type, size)?.trim().replace(/\s+/g, ' ')! : style!

  let isDisabled = false

  if (onClick) {
    button.addEventListener('click', () => {
      if (isDisabled) return
      onClick(() => isDisabled = true)
    })
    
    parentElement.addEventListener('keydown', (e) => {
      if (!disableKey && !isDisabled && e.key === 'Enter') {
        onClick(() => isDisabled = true)
      }
    })
  }

  if (onHover) {
    button.addEventListener('mouseenter', onHover)
  }

  parentElement.appendChild(button)
  return button
}