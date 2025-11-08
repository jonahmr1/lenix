fx_version 'cerulean'
game 'gta5'
dependencies {
    'tr_lib',
    'tr_kit',
    'qb-core',
    'oxmysql',
}

author 'Lenix'
version '2.0.0'

shared_scripts {
    'config/shared.js',
    'shared/main.js',
}

client_scripts {
    'client/peds.js',
    'client/interactions.js',
    'client/menus.js',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
}