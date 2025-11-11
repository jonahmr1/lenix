Menu.main = function(key) {
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)
    const options = [
        {
            title: menu.main.browse.title,
            description: menu.main.browse.description,
            icon: menu.main.browse.icon,
            onClick: function() {
                Menu.list(key)
            }
        },
        {
            title: menu.main.preview.title, 
            description: menu.main.preview.description,
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
    ]
    Bridge.menu.open(options)
}