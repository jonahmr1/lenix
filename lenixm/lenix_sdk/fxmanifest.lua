fx_version 'cerulean'
game 'gta5'

file 'Client/bin/Release/**/publish/*.dll'

client_script 'Client/bin/Release/**/publish/*.net.dll'
server_script 'Server/bin/Release/**/publish/*.net.dll'

author 'Lenix'
version '0.0.1'
description 'A SDK containing a bunch of features and utilities for Expert Scripting Programmers'

ui_page 'Nui/dist/index.html'
files {
  'Nui/dist/index.html',
  'Nui/dist/assets/index-*.css',
  'Nui/dist/assets/index-*.js',
}