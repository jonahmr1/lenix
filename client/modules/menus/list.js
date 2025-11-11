Menu.list = async function(key) {
    const options = []
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)
    const itemConfig = System[key].ITEM
    const configItems = Items[itemConfig]

    options.push({
        title: menu.subMain.return.title,
        icon: menu.subMain.return.icon,
        onClick: function() {
            Menu.main(key)
        }
    })

    if (configItems) {
        const optionsPromises = configItems.map(async (item, index) => {
            const processedItem = tableFiller(Items._DEFAULT, item)
            const restricted = !await isPlayerAllowed(processedItem)
            let description = menu.subMain.list.descriptions
            if (!restricted) {
                if (processedItem.registerable) {
                    description = description.get[0] + Vehicles[item.vehicle]?.name + description.get[1] + processedItem.price
                } else {
                    description = description.take + Vehicles[item.vehicle]?.name
                }
            } else {
                description = menu.subMain.list.disabled
            }
            return {
                title: Vehicles[item.vehicle]?.name || processedItem.label,
                description: description,
                icon: (processedItem.registerable) ? menu.subMain.list.icons.get : menu.subMain.list.icons.buy,
                restricted: restricted,
                image: processedItem.image,
                onClick: function() {
                    if (IsZoneFree(System[key].VEHICLES.spawn)) {
                        emitNet('lenix_vehicles:proccess', key, index)
                    } else {
                        Bridge.notify('The Spawn Point Is Not Free !', 'error')
                    }
                }
            }
        })

        const options = await Promise.all(optionsPromises)
        Bridge.menu.open(options)
    } else {
        console.warn("Warning: No vehicles found for item: " + itemConfig)
    }
}