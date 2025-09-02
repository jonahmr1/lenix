fx_version 'adamant'

game 'gta5'
lua54 'yes'

description "A Simple Police Garage"

client_scripts {
    'client/*.lua',
    'config/client.lua',
}

shared_script '@ox_lib/init.lua'

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua',
    'config/server.lua',
}