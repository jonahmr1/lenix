const vehicles = exports['qb-core'].GetSharedVehicles()
let Menu = {}
Menu.main = function(key) {
    const menu = {
        ...System[key].MENU,
        ...System._DEFAULT.MENU,
        main: {
            ...System[key].MENU?.main,
            ...System._DEFAULT.MENU.main,
            browse: {
                ...System[key].MENU?.main?.browse,
                ...System._DEFAULT.MENU.main.browse,
            },
            preview: {
                ...System[key].MENU?.main?.preview,
                ...System._DEFAULT.MENU.main.preview,
            },
        },
        subMain: {
            ...System[key].MENU?.subMain,
            ...System._DEFAULT.MENU.subMain,
            list: {
                ...System[key].MENU?.subMain?.list,
                ...System._DEFAULT.MENU.subMain.list,
            },
            preview: {
                ...System[key].MENU?.subMain?.preview,
                ...System._DEFAULT.MENU.subMain.preview,
            },
            return: {
                ...System[key].MENU?.subMain?.return,
                ...System._DEFAULT.MENU.subMain.return,
            },
        },
    }

    const options = [
        {
            header: menu.main.browse.header,
            txt: menu.main.browse.txt,
            icon: menu.main.browse.icon,
            action: function() {
                Menu.list(key)
            }
        },
        {
            header: menu.main.preview.header, 
            txt: menu.main.preview.txt,
            icon: menu.main.preview.icon,
            action: function() {
                Menu.preview(key)
            }
        },
        {
            header: menu.main.exit.header,
            icon: menu.main.exit.icon,
            action: function() {
                exports['qb-menu'].closeMenu()
            }
        }
    ]
    exports['qb-menu'].openMenu(options)
}

Menu.list = function(key) {
    const options = []
    const menu = {
        ...System[key].MENU,
        ...System._DEFAULT.MENU,
        main: {
            ...System[key].MENU?.main,
            ...System._DEFAULT.MENU.main,
            browse: {
                ...System[key].MENU?.main?.browse,
                ...System._DEFAULT.MENU.main.browse,
            },
            preview: {
                ...System[key].MENU?.main?.preview,
                ...System._DEFAULT.MENU.main.preview,
            },
        },
        subMain: {
            ...System[key].MENU?.subMain,
            ...System._DEFAULT.MENU.subMain,
            list: {
                ...System[key].MENU?.subMain?.list,
                ...System._DEFAULT.MENU.subMain.list,
            },
            preview: {
                ...System[key].MENU?.subMain?.preview,
                ...System._DEFAULT.MENU.subMain.preview,
            },
            return: {
                ...System[key].MENU?.subMain?.return,
                ...System._DEFAULT.MENU.subMain.return,
            },
        },
    }
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
        const defaultItems = Items._DEFAULT
    
        configItems.forEach((item, index) => {
            Object.keys(item.allowed || defaultItems.allowed).forEach(element => {
                if (element === playerJob) {
                    if ((item?.allowed?.[element] || defaultItems.allowed[element]) <= playerGrade) {
                        return
                    }
                }
            });
            const description = (item.registerable || defaultItems.registerable) ? ("Get: " + vehicles[item.vehicle]?.name + " For: $" + (item.price || defaultItems.price)) : ("Take Out " + vehicles[item.vehicle]?.name)

            options.push({
                header: vehicles[item.vehicle]?.name,
                txt: description,
                icon: (item.registerable || defaultItems.registerable) ? "fas fa-dollar-sign" : "fas fa-key",
                image: (item.image || defaultItems.image),
                action: function() {
                    emitNet('lenix_vehicles:proccess', key, index)
                }
            })
        })
    } else {
        console.log("Warning: No vehicles found for item: " + itemConfig)
    }
    exports['qb-menu'].openMenu(options)
}

Menu.preview = function(key) {
    const options = []
    const itemConfig = System[key].ITEM
    const confgItems = Items[itemConfig]
    const menu = {
        ...System[key].MENU,
        ...System._DEFAULT.MENU,
        main: {
            ...System[key].MENU?.main,
            ...System._DEFAULT.MENU.main,
            browse: {
                ...System[key].MENU?.main?.browse,
                ...System._DEFAULT.MENU.main.browse,
            },
            preview: {
                ...System[key].MENU?.main?.preview,
                ...System._DEFAULT.MENU.main.preview,
            },
        },
        subMain: {
            ...System[key].MENU?.subMain,
            ...System._DEFAULT.MENU.subMain,
            list: {
                ...System[key].MENU?.subMain?.list,
                ...System._DEFAULT.MENU.subMain.list,
            },
            preview: {
                ...System[key].MENU?.subMain?.preview,
                ...System._DEFAULT.MENU.subMain.preview,
            },
            return: {
                ...System[key].MENU?.subMain?.return,
                ...System._DEFAULT.MENU.subMain.return,
            },
        },
    }

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
        console.log("Warning: No vehicles found for item: " + itemConfig)
    }
    exports['qb-menu'].openMenu(options)
}