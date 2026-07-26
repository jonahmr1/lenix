import { useState } from 'react'
import type { GeneratedButtons, Configs } from '../../types'
import { onClick, storageAddresses } from '../..'
import Button from "../../wrappers/button"

const getStoredButtons = (): GeneratedButtons => JSON.parse(localStorage.getItem(storageAddresses.inputs) || '{}')

const getStoredButton = (command: string) => {
  const storage = getStoredButtons()
  if (storage[command]) return storage[command]
}

const removeStorageButton = (command: string) => {
  localStorage.setItem(storageAddresses.inputs, JSON.stringify({ ...getStoredButtons(), [command]: undefined }))
}

const Inputs = ({
  args, command
}: {
  args: Configs["InputArgs"]
  command: string,
}) => {
  const [, reRender] = useState(0)
  return (
    <form
      className={`flex flex-col`}
      onSubmit={Event => {
        Event.preventDefault()
        const formData = new FormData(Event.currentTarget)
        const values = Array.from(formData.values())
        onClick(command, values.map(value => String(value)))
        
        if (args) for (let i = 0; i < args.length; i++) {
          if (args[i].storageSave) {
            values.forEach((value, index) => {
              if (index === i) {
                localStorage.setItem(storageAddresses.inputs, JSON.stringify({[args[i].storageSave as string]: value}))
              }
            })
          }
        }
      }}
    >
      {args?.map(({ placeholder, required }, index) => 
        <input
          key={index}
          name={`input-${index}`}
          type="text"
          placeholder={placeholder}
          required={required}
          className='text-black'
        />
      )}
      {getStoredButton(command) && 
        <Button {...{
          label: `${getStoredButton(command)}: ${command}`,
          onMouseDown: () => {
            removeStorageButton(command)
            onClick(command, getStoredButton(command))
            reRender(_ => _ + 1)
          }
        }}/>
      }
      <Button type={'submit'} style={"bg-blue-500"} label={"Submit"} />
    </form>
  )
}

export default Inputs