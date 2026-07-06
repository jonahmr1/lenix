fx_version 'cerulean'
game 'gta5'

dependencies {
	'ox_lib',
	'ox_core',
	'ox_inventory',
	'ox_target',
	'pma-voice',
}

shared_script '@ox_li/init.lua'
client_scripts {
	'dist/client.js',
	'src/client/**/*.lua',
}
server_scripts {
	'dist/server.js',
	'src/server/**/*.lua'
}
files {
	'src/web/dist/**',
}
ui_page	'src/web/dist/index.html'