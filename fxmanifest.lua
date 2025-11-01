fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib',
  'ox_inventory',
  'qbx_core',
}

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.0.6'

server_scripts {
  'server/main.lua',
}
client_scripts {
  'client/main.lua',
}
ui_page 'web/index.html'
files {
  'web/**',
  'server/bridge.lua'
}

escrow_ignore {
  'config/server.lua',
  'server/bridge.lua'
}