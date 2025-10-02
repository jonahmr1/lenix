fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
    'qb-core',
    'qb-menu',
    'qb-target',
    'ox_lib'
}

author 'Trippler Hub'

shared_script '@ox_lib/init.lua'
client_scripts {
    'client/*.lua',
    'config/client.lua',
}
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua',
    'config/server.lua',
}