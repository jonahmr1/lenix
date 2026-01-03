fx_version 'cerulean'
game 'gta5'
dependencies {
  --[[ only if you are using createSingleVehicles || createMutlipleVehicles with the register feature
  'qb-core',
  'oxmysql',
    ]]
}

author 'Trippler'
version '2.1.2'
repository 'https://github.com/TripplerScripts/tr_kit'

server_scripts {
  'dist/server.js',
}
client_scripts {
  'dist/client.js',
}