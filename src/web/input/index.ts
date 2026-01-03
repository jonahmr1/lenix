interface InputOptions {
  parent: string
  style?: string
  defaultValue?: string
  placeholder?: string
  type?: string
  onJoin?: () => void
  onChange?: () => void
  onSubmit?: () => void
}

export default ({
    parent,
    style = "bg-stone-800 outline-none p-2 rounded text-white",
    defaultValue = "",
    placeholder = "press tab to jump in",
    type = "text",
    onJoin,
    onChange,
    onSubmit,
  }: InputOptions): typeof input => {

  const input = document.createElement("input")

  input.type = type
  input.value = defaultValue
  input.placeholder = placeholder
  input.className = style

  if (onSubmit) input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      onSubmit()
    }
  })
  
  if (onChange) input.addEventListener("input", onChange)
  if (onJoin) input.addEventListener("click", onJoin)

  document.getElementById(parent)?.appendChild(input)

  return input
}