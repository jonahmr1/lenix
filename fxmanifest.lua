fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib',
  'tr_kit',
  'qbx_core',
  'ox_inventory',
}

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.0.2'

shared_scripts {
  'config/shared.lua',
}
server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/settings.lua',
  'server/main.lua',
}
client_scripts {
  'config/client.lua',
  'client/settings.lua',
  'client/main.lua',
}
ui_page 'web/index.html'
file 'web/**'

escrow_ignore {
  'config/client.lua',
  'config/shared.lua',
  'client/settings.lua',
  'server/settings.lua',
}