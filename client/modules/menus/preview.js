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
            const image = tableFiller(Items._DEFAULT.image, item?.image)
            options.push({
                title: `${menu.subMain.preview.title} ${Bridge.getVehicles(item.vehicle)?.name}`,
                icon: menu.subMain.preview.icon,
                image: image,
                onClick: function() {
                    PreviewVehicle(key, index)
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
    Bridge.menu.open(main, options)
}