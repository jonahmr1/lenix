fx_version 'cerulean'
game 'gta5'
dependencies {
  'qbx_core',
  'illenium-appearance',
  'oxmysql',
  --[[ MariaDB 8.0.13 ]]
}

author 'Lenix'
version '2.0.0'

client_scripts {
  '@ox_lib/init.lua',
  'build/client.lua',
  'build/client.js',
}

server_scripts {
  'build/server.js',
}

ui_page 'nui/public/index.html'
files {
  'build/nui.js',
  'nui/**'
}