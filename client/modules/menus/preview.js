Menu.preview = function(key) {
    const options = []
    const itemConfig = System[key].ITEM
    const confgItems = Items[itemConfig]
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)

    options.push({
        title: menu.subMain.return.title,
        icon: menu.subMain.return.icon,
        onClick: function() {
            Menu.main(key)
        }
    })

    if (confgItems) {
        confgItems.forEach((item, index) => {
            options.push({
                title: Vehicles[item.vehicle]?.name,
                description: "Preview: " + Vehicles[item.vehicle]?.name,
                icon: "fas fa-search",
                image: item?.image || Items._DEFAULT.image,
                onClick: function() {
                    PreviewVehicle(key, index)
                }
            })
        })
    } else {
        console.warn("Warning: No vehicles found for item: " + itemConfig)
    }
    Bridge.menu.open(options)
}