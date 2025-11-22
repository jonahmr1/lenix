fx_version 'cerulean'
game 'gta5'
dependencies {
    'tr_lib',
    --[[ only if you are using createSingleVehicles || createMutlipleVehicles with the register feature
    'qb-core',
    'oxmysql',
     ]]
}

author 'Trippler'
version '1.0.0'

shared_scripts {
    'shared.js',
    'modules/blips/shared.js',
}
server_scripts {
    'bridge/server.js',
    'modules/pedestrians/server.js',
    'modules/vehicles/server.js',
}
client_scripts {
    'bridge/client.js',
    'modules/pedestrians/client.js',
    'modules/vehicles/client.js',
}