fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'ox_inventory',
  'qbx_core',
  'Renewed-Banking',
}

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.0.0'

shared_scripts {
  '@ox_lib/init.lua'
}
server_scripts {
  'server/main.lua',
}
client_scripts {
  'client/main.lua',
}
ui_page 'web/index.html'
files {
  'web/**',
  'bridge/server.lua'
}

escrow_ignore {
  'config/server.lua',
}