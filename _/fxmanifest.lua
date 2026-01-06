fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib',
  'qbx_core',
}

author 'https://github.com/LenixDev'
version '1.0.8'

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