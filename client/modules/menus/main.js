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
        },
        {
            title: menu.main.exit.title,
            icon: menu.main.exit.icon,
            onClick: function() {
                Bridge.menu.close()
            }
        }
    ].filter(Boolean)
    Bridge.menu.open(options)
}