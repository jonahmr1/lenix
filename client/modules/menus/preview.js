Menu.preview = function(key) {
    const options = []
    const itemConfig = System[key].ITEM
    const confgItems = Items[itemConfig]
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)

    options.push({
        header: menu.subMain.return.header,
        icon: menu.subMain.return.icon,
        action: function() {
            Menu.main(key)
        }
    })

    if (confgItems) {
        confgItems.forEach((item, index) => {
            options.push({
                header: vehicles[item.vehicle]?.name,
                txt: "Preview: " + vehicles[item.vehicle]?.name,
                icon: "fas fa-search",
                image: item?.image || Items._DEFAULT.image,
                action: function() {
                    emit('lenix_vehicles:preview', index)
                }
            })
        })
    } else {
        console.warn("Warning: No vehicles found for item: " + itemConfig)
    }
    exports['qb-menu'].openMenu(options)
}