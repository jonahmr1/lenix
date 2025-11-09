Menu.main = function(key) {
    const menu = tableFiller(System[key].MENU, System._DEFAULT.MENU)
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