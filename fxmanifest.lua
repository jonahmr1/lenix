fx_version 'cerulean'
game 'gta5'
dependencies {
    'tr_lib',
    'tr_kit',
    'qb-core',
    'oxmysql',
}

author 'Lenix'
version '3.1.0'

shared_scripts {
    'config/shared.js',
    'shared/main.js',
}

client_scripts {
    'client/bridge.js',
    'client/modules/peds.js',
    'client/modules/interactions.js',
    'client/modules/menus.js',
    'client/modules/preview.js',
    'client/modules/spawn.js',
    'client/modules/menus/main.js',
    'client/modules/menus/list.js',
    'client/modules/menus/preview.js',
    'client/main.js',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/bridge.js',
    'server/main.js',
    'server/modules/db.js',
    'server/modules/process.js',
    'server/modules/allow.js',
}