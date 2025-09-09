fx_version 'cerulean'
game 'gta5'
lua54 'yes'
escrow_ignore {
  'config/*.lua',
}

shared_scripts {
  '@ox_lib/init.lua'
}
server_scripts {
  'server/main.lua',
}
client_scripts {
  'client/main.lua',
  'config/client.lua'
}

ui_page 'web/src/index.html'

files {
  'config/server.lua',
  'web/src/index.html',
  'web/src/style.css',
  'web/src/script.js',
}

dependencies {
  'ox_inventory',
  'qbx_core',
  'tr_banking',
}