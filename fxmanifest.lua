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
version '1.1.3'
repository 'https://github.com/TripplerScripts/tr_kit'

shared_scripts {
    'shared.js',
    'exports/blips/shared.js',
}
server_scripts {
    'bridge/server.js',
    'exports/pedestrians/server.js',
    'exports/vehicles/server.js',
}
client_scripts {
    'bridge/client.js',
    'exports/pedestrians/client.js',
    'exports/vehicles/client.js',
    'exports/camera/client.js',
}