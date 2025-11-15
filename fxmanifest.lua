fx_version 'cerulean'
game 'gta5'
dependencies {
    'tr_lib',
}

author 'Trippler'
version '0.1.1'

shared_scripts {
    'shared.js',
    'modules/blips/shared.js',
}
server_scripts {
    'modules/pedestrians/server.js',
    'modules/vehicles/server.js',
}
client_scripts {
    'modules/pedestrians/client.js',
    'modules/vehicles/client.js',
}