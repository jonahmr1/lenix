fx_version 'cerulean'
game 'gta5'
dependencies {
    'tr_lib',
}

author 'Trippler'
version '0.0.7'

shared_scripts {
    'shared.js',
    'modules/blips/shared.js',
}
server_scripts {
    'modules/pedestrians/server.js',
}
client_scripts {
    'modules/pedestrians/client.js'
}