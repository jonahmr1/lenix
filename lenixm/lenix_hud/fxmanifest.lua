fx_version 'cerulean'
game 'gta5'
dependencies {
	'qb-core',
	'tr_lib'
}

author 'https://github.com/LenixDev'
version '2.0.1'

shared_script '@tr_lib/index.lua'

client_script 'client/index.lua'
server_script 'server/index.lua'

ui_page 'nui/public/index.html'
files {
  'nui/public/index.html',
  'build/nui.js',
	'shared/**/*.lua',
	'server/**/*.lua',
	'client/**/*.lua',
}
