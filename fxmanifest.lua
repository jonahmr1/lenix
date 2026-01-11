fx_version 'cerulean'
game 'gta5'
dependencies {
  'oxmysql',
  --[[ MariaDB 8.0.13 ]]
}

author 'Trippler'
version '0.0.0'

client_scripts {
  'build/client.js',
}
server_scripts {
  'build/server.js',
}

ui_page 'nui/public/index.html'
files {
  'nui/public/index.html',
  'build/nui.js'
}