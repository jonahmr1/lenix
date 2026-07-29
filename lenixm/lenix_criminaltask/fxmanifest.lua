fx_version 'cerulean'
game 'gta5'
dependencies {
  'qbx_core',
	'tr_lib',
	'tr_kit'
}

author 'https://github.com/LenixDev'
version '2.0.1'

shared_script '@tr_lib/index.lua'
client_script 'client/index.lua'
server_script 'server/index.lua'

files {
	'client/**/*.lua',
	'server/**/*.lua',
	'shared/**/*.lua',
}
