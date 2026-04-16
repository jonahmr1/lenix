fx_version 'cerulean'
game 'gta5'

author 'https://github.com/LenixDev'
version '2.0.0'

dependencies {
  'qbx_core',
  'pma-voice',
  'tr_lib'
}

shared_script '@tr_lib/index.lua'

client_scripts {
  'client/index.lua',
  'client/api/*.lua',
  'client/modules/*.lua',
  'client/nui/*.lua'
}

server_scripts {
  'server/index.lua',
  'server/api/*.lua',
  'server/services/*.lua'
}

ui_page 'nui/public/index.html'

files {
  'nui/public/index.html',
  'build/nui.js',
  'shared/**/*.lua'
}