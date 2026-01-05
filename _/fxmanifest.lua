fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib',
  'tr_kit',
  'qbx_core'
}

author 'https://github.com/LenixDev'
version '1.0.4'

files {
  'config/client.lua',
  'config/shared.lua',
}
server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/settings.lua',
  'server/main.lua',
}
client_scripts {
  'client/settings.lua',
  'client/main.lua',
}
ui_page 'web/index.html'
file 'web/**'