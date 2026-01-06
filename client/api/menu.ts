import { bridge } from "."
import { IsZoneFree } from ".."
import { config, settings } from "../../shared/constants"
import { tableFiller } from "../../shared/utils"
import { triggerPromise } from "@trippler/tr_lib/client"
import { previewVehicle } from "./preview"

export const mainMenu = (key: unknown) => {
  const menu = tableFiller(settings[key].MENU, settings._DEFAULT.MENU)
  const options = [
    {
      title: menu.main.browse.title,
      icon: menu.main.browse.icon,
      onClick: function () {
        listMenu(key)
      }
    },
    !settings[key].VEHICLES.preview.isDisabled && {
      title: menu.main.preview.title,
      icon: menu.main.preview.icon,
      onClick: function () {
        previewMenu(key)
      }
    }
  ].filter(Boolean)
  const main = {
    id: 'main_menu',
    header: menu.main.header
  }
  bridge.menu.open(main, options)
}

const isPlayerAllowed = async (processedItem: unknown) => {
  const allowedTargets = processedItem.allowed
  const disallowedTargets = processedItem.disallowed
  let isAllowed = false
  
  const inAllowList = await triggerPromise('isPlayerInAllowList', allowedTargets)
  const notInDisallowList = await triggerPromise('isPlayerNotInDisallowedList', disallowedTargets)

  if (notInDisallowList) {
    isAllowed = inAllowList ? true : false
  }
  return isAllowed
}

const spawnSelectedVehicle = (key: unknown, index: unknown, zone: unknown) => {
  if (IsZoneFree(zone)) {
    emitNet('lenix_vehicles:proccess', key, index)
  } else {
    bridge.notify('The Spawn Point Is Not Free !', 'error')
  }
}

const listMenu = async (key) => {
  const options = []
  const menu = tableFiller(settings[key].MENU, settings._DEFAULT.MENU)
  const itemConfig = settings[key].ITEM
  const configItems = config[itemConfig]

  options.push({
    title: menu.subMain.return.title,
    icon: menu.subMain.return.icon,
    onClick: function () {
      mainMenu(key)
    }
  })

  if (configItems) {
    for (let index = 0; index < configItems.length; index++) {
      const item = configItems[index]
      const processedItem = tableFiller(config._DEFAULT, item)
      const restricted = !await isPlayerAllowed(processedItem)

      let description = menu.subMain.list.descriptions
      if (!restricted) {
        if (processedItem.registerable) {
          description = description.get[0] + bridge.getVehicles(item.vehicle)?.name + description.get[1] + processedItem.price
        } else {
          description = description.take + bridge.getVehicles(item.vehicle)?.name
        }
      } else {
        description = menu.subMain.list.disabled
      }

      options.push({
        title: bridge.getVehicles(item.vehicle)?.name || processedItem.label,
        description: description,
        icon: (processedItem.registerable) ? menu.subMain.list.icons.get : menu.subMain.list.icons.buy,
        restricted: restricted,
        image: processedItem.image,
        onClick: function () {
          spawnSelectedVehicle(key, index, settings[key].VEHICLES.spawn)
        }
      })
    }

    const main = {
      id: 'list_menu',
      header: menu.subMain.list.title
    }
    bridge.menu.open(main, options)
  } else {
    console.warn("Warning: No vehicles found for item: " + itemConfig)
  }
}

const previewMenu = (key: unknown) => {
  const options = []
  const itemConfig = settings[key].ITEM
  const confgItems = config[itemConfig]
  const menu = tableFiller(settings[key].MENU, settings._DEFAULT.MENU)

  options.push({
    title: menu.subMain.return.title,
    icon: menu.subMain.return.icon,
    onClick: function () {
      mainMenu(key)
    }
  })

  if (confgItems) {
    confgItems.forEach((item, index) => {
      const image = tableFiller(config._DEFAULT.image, item?.image)
      options.push({
        title: `${menu.subMain.preview.title} ${bridge.getVehicles(item.vehicle)?.name}`,
        icon: menu.subMain.preview.icon,
        image: image,
        onClick: function () {
          previewVehicle(key, index)
        }
      })
    })
  } else {
    console.warn("Warning: No vehicles found for item: " + itemConfig)
  }
  const main = {
    id: 'preview',
    header: menu.subMain.preview.title,
  }
  bridge.menu.open(main, options)
}