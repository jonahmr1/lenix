fx_version 'adamant'

game 'gta5'
lua54 'yes'
author 'https://github.com/lenix-x'

description "A Simple Police Garage"

client_scripts {
    'client/*.lua',
    'config/client.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua',
    'config/server.lua',
}