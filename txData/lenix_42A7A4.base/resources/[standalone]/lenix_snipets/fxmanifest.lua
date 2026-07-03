fx_version 'cerulean'
game 'gta5'

dependencies {
	'ox_lib'
} 

shared_script '@ox_lib/init.lua'
client_scripts {
	'dist/client.js',
	'src/client/**/*.lua'
}
server_scripts {
	'dist/server.js',
	'src/server/**/*.lua'
}