Menu.list = function(key) {
    const options = []
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)
    const itemConfig = System[key].ITEM
    const configItems = Items[itemConfig]

    options.push({
        header: menu.subMain.return.header,
        icon: menu.subMain.return.icon,
        action: function() {
            Menu.main(key)
        }
    })

    if (configItems) {
        const playerJob = Bridge.getPlayerJob().name
        const playerGrade = Bridge.getPlayerJob().gradeLevel
    
        configItems.forEach((item, index) => {
            const processedItem = tableFiller(item, Items._DEFAULT)
            Object.keys(processedItem.allowed).forEach(element => {
                if (element === playerJob) {
                    if (processedItem?.allowed?.[element] <= playerGrade) {
                        return
                    }
                }
            });
            const description = (processedItem.registerable) ? ("Get: " + Vehicles[item.vehicle]?.name + " For: $" + processedItem.price) : ("Take Out " + Vehicles[item.vehicle]?.name)

            options.push({
                header: Vehicles[item.vehicle]?.name,
                txt: description,
                icon: (processedItem.registerable) ? "fas fa-dollar-sign" : "fas fa-key",
                image: processedItem.image,
                action: function() {
                    if (IsZoneFree(System[key].VEHICLES.spawn)) {
                        emitNet('lenix_vehicles:proccess', key, index)
                    } else {
                        Bridge.notify('The Spawn Point Is Not Free !', 'error')
                    }
                }
            })
        })
    } else {
        console.warn("Warning: No vehicles found for item: " + itemConfig)
    }
    exports['qb-menu'].openMenu(options)
}