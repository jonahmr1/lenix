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
        const playerJob = QBCore.Functions.GetPlayerData().job.name
        const playerGrade = QBCore.Functions.GetPlayerData().job.grade.level
    
        configItems.forEach((item, index) => {
            const processedItem = tableFiller(item, Items._DEFAULT)
            Object.keys(processedItem.allowed).forEach(element => {
                if (element === playerJob) {
                    if (processedItem?.allowed?.[element] <= playerGrade) {
                        return
                    }
                }
            });
            const description = (processedItem.registerable) ? ("Get: " + vehicles[item.vehicle]?.name + " For: $" + processedItem.price) : ("Take Out " + vehicles[item.vehicle]?.name)

            options.push({
                header: vehicles[item.vehicle]?.name,
                txt: description,
                icon: (processedItem.registerable) ? "fas fa-dollar-sign" : "fas fa-key",
                image: processedItem.image,
                action: function() {
                    emitNet('lenix_vehicles:proccess', key, index)
                }
            })
        })
    } else {
        console.warn("Warning: No vehicles found for item: " + itemConfig)
    }
    exports['qb-menu'].openMenu(options)
}