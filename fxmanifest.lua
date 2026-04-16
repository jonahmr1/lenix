fx_version 'cerulean'
game 'gta5'
dependencies {
  'qbx_core',
	'tr_lib'
}

author 'https://github.com/LenixDev'
version '2.0.0'

client_script 'client/index.lua'
server_script 'server/index.lua'
shared_script '@tr_lib/index.lua'

files {
	'client/**/*.lua',
	'server/**/*.lua',
	'shared/**/*.lua',
}
