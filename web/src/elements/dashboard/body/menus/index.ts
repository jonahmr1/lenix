import { useDiv, useButton} from "@trippler/tr_kit/web"
import serviceUnavailable from "../../../../components/dashboard/serviceUnavailable"

const buttonsStyle = "text-2xl text-white italic h-1/5"
const buttonsContentsStyle = "hover:font-semibold hover:text-3xl transition-all"
const buttonsOnClick = serviceUnavailable

useDiv({
  parent: "body",
  id: "menus",
  className: "w-[20%] h-[75%] flex flex-col items-center gap-5"
})

useDiv({
  parent: "menus",
  className: "w-[80%] blured-15 h-1/2"
})
useDiv({
  parent: "menus",
  id: "main-menu",
  className: "w-[80%] h-1/2 blured-15 flex justify-end"
})

useDiv({
  parent: "main-menu",
  id: "main-menu-block",
  className: "flex flex-col justify-center overflow-hidden w-[75%]"
})

useButton({
  parent: "main-menu-block",
  className: buttonsStyle,
  content: `<span class="${buttonsContentsStyle}">Battlepass</span>`,
  onClick: buttonsOnClick
})

useButton({
  parent: "main-menu-block",
  className: buttonsStyle,
  content: `<span class="${buttonsContentsStyle}">Settings</span>`,
  onClick: buttonsOnClick
})

useButton({
  parent: "main-menu-block",
  className: buttonsStyle,
  content: `<span class="${buttonsContentsStyle}">Arsenal</span>`,
  onClick: buttonsOnClick
})

useButton({
  parent: "main-menu-block",
  className: buttonsStyle,
  content: `<span class="${buttonsContentsStyle}">Store</span>`,
  onClick: buttonsOnClick
})

useButton({
  parent: "main-menu-block",
  className: buttonsStyle,
  content: `<span class="${buttonsContentsStyle}">Style</span>`,
  onClick: buttonsOnClick
})

useButton({
  parent: "main-menu-block",
  className: buttonsStyle,
  content: `<span class="${buttonsContentsStyle}">Play</span>`,
  onClick: buttonsOnClick
})