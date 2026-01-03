import { useDiv, useButton} from "@trippler/tr_kit/web";
import { nuiFocus } from "@trippler/tr_lib/web";
let alerts = []

const types = {
  success: '<svg fill="#04ff00" width="48px" height="48px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>success-standard-line</title> <path class="clr-i-outline clr-i-outline-path-1" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"></path><path class="clr-i-outline clr-i-outline-path-2" d="M28,12.1a1,1,0,0,0-1.41,0L15.49,23.15l-6-6A1,1,0,0,0,8,18.53L15.49,26,28,13.52A1,1,0,0,0,28,12.1Z"></path> <rect x="0" y="0" width="36" height="36" fill-opacity="0"></rect> </g></svg>',
  error: '<svg width="48px" height="48px" viewBox="0 0 16.00 16.00" xmlns="http://www.w3.org/2000/svg" fill="#ff0000" stroke="#ff0000" stroke-width="0.00016"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6zM7.9 7.5L10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7 2.4 2.5z"></path></g></svg>',
  warn: '<svg width="64px" height="64px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="2.544"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#FFA500;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M3.5,39.7734,24.0521,4.2093,44.5,39.7907Z"></path><circle class="a" cx="24.06" cy="33.0726" r="0.25"></circle><path class="a" d="M24.0579,14.6774v13.26"></path></g></svg>',
  info: '<svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="info-circle"> <g> <circle cx="12" cy="12" data-name="--Circle" fill="none" id="_--Circle" r="10" stroke="#007bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <line fill="none" stroke="#007bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="12" y2="16"></line> <line fill="none" stroke="#007bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="8" y2="8"></line> </g> </g> </g> </g></svg>',
}

interface AlertOptions {
  type: 'success' | 'error' | 'warn' | 'info'
  title: string
  message: string
  button?: string // BWC
  onClick?: () => void // BWC
  buttons?: Array<{
    content: string
    type?: 'primary' | 'secondary' | 'soft' | 'none';
    onClick: () => void
  }>
}

export default ({ type, title, message, button, buttons, onClick }: AlertOptions): [typeof index, number] => {
  alerts.push(alerts.length)
  document.body.setAttribute('id', 'index')
  document.body.setAttribute('class', 'relative')
  const index = useDiv({
    parent: "index",
    style: "absolute top-0 flex flex-col justify-center bg-stone-900/95 w-full h-[100vh]",
    id: "alert-" + alerts.length
  })
  
  useDiv({
    parent: "alert-" + alerts.length,
    id: "alert-content-block-" + alerts.length,
    style: "w-full h-[30%] bg-stone-800 flex flex-col items-center justify-around",
  })

  useDiv({
    parent: "alert-" + alerts.length,
    id: "alert-button-block-" + alerts.length,
    style: "w-full h-fit py-2 gap-1 bg-stone-700 flex flex-col items-center justify-center",
  })
  
  useDiv({
    parent: "alert-content-block-" + alerts.length,
    id: "alert-title",
    style: "text-white tracking-tighter text-center text-4xl italic font-extrabold flex gap-3 items-center",
    content: (types[type] || types['info']) + title.toUpperCase(),
  })

  useDiv({
    parent: "alert-content-block-" + alerts.length,
    style: "text-gray-300 max-w-[60%] text-center",
    content: message
  })

  button != undefined && useButton({
    parent: "alert-button-block-" + alerts.length,
    content: button,
    size: "xl",
    type: "soft",
    onClick: () => {
      index.remove(),
      onClick && onClick()
    }
  })

  buttons?.forEach(button => {
    useButton({
      parent: "alert-button-block-" + alerts.length,
      content: button.content,
      size: "xl",
      type: button?.type || "soft",
      onClick: () => {
        index.remove(),
        button.onClick && button.onClick()
      }
    })
  })
  nuiFocus(true, true)
  return [index, alerts.length]
}