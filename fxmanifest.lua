fx_version 'cerulean'
game 'gta5'
dependencies {
  'tr_lib',
  'qbx_core',
}

author 'https://gitb.com/LenixDev'
version '4.0.0'

client_script 'build/client.js'
server_script 'build/server.js'

ui_page 'nui/public/index.html'
files {
  'nui/public/index.html',
  'build/nui.js'
}
