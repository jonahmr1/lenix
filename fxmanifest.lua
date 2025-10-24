fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'qbx_core',
  'ox_inventory',
  'ox_target',
  'ox_lib'
}

author 'Trippler'
docs 'https://docs.trippler.store'

shared_scripts {
  '@ox_lib/init.lua',
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
ui_page 'web/build/index.html'
file 'web/**'

escrow_ignore {
  'config/*.lua',
  'client/settings.lua',
  'server/settings.lua',
}