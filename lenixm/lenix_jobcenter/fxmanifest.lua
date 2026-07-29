fx_version 'cerulean'
game 'gta5'

author 'https://github.com/LenixDev'
version '2.0.1'

dependencies {
  'qbx_core',
  'ox_lib',
  'tr_lib',
  'tr_kit'
}

shared_scripts {
  '@tr_lib/index.lua',
  'shared/utils/index.lua',
  'shared/constants/index.lua'
}

client_scripts {
  'client/index.lua',
  'client/game/index.lua',
  'client/api/index.lua',
  'client/modules/index.lua',
  'client/nui/index.lua'
}

server_scripts {
  'server/index.lua',
  'server/api/index.lua',
  'server/services/index.lua'
}

ui_page 'nui/public/index.html'

files {
  'nui/public/index.html',
  'build/nui.js'
}