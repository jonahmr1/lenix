fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
    'qb-core',
    'oxmysql',
}

author 'Lenix'

client_scripts {
    'client/*.lua',
    'config/client.lua',
}
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua',
    'config/server.lua',
}

escrow_ingore {
    'config/client.lua',
    'config/server.lua'
}