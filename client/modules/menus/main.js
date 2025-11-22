Menu.main = function(key) {
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)
    const options = [
        {
            title: menu.main.browse.title,
            icon: menu.main.browse.icon,
            onClick: function() {
                Menu.list(key)
            }
        },
        !System[key].VEHICLES.preview.isDisabled && {
            title: menu.main.preview.title, 
            icon: menu.main.preview.icon,
            onClick: function() {
                Menu.preview(key)
            }
        }
    ].filter(Boolean)
    const main = {
        id: 'main_menu',
        header: menu.main.header
    }
    Bridge.menu.open(main, options)
}