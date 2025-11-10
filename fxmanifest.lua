fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.18.0'

files {
  'config.json',
}

shared_scripts {
  'init.lua',
  'modules/require/shared.lua',
  'modules/load/shared.lua',
  'modules/print/shared.lua',
  'modules/split/shared.lua',
  'modules/resources/shared.lua',
  'modules/metadata/shared.lua',
  'modules/filter/shared.lua',
  'modules/get/closestVehicle/shared.lua',
  'modules/get/isInVehicle/shared.lua',
}

client_scripts {
  'modules/callback/client.lua',
  'modules/request/client.lua',
  'modules/get/isZoneFree/client.lua',
}

server_scripts {
  'modules/callback/server.lua',
  'modules/version/server.lua',
}

shared_script 'get.lua'