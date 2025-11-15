fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
repository 'https://github.com/TripplerScripts/tr_lib'
version '1.23.0'

files {
  'config.json',
  'modules/version/server.lua'
}

shared_scripts {
  'init.lua',
  'modules/require/shared.lua',
  'modules/load/shared.lua',
  'modules/console/shared.lua',
  'modules/split/shared.lua',
  'modules/resources/shared.lua',
  'modules/metadata/shared.lua',
  'modules/filter/shared.lua',
  'modules/existing/instance/shared.lua',
}

client_scripts {
  'modules/callback/client.lua',
  'modules/request/client.lua',
  'modules/get/isZoneClear/client.lua',
  'modules/get/closestVehicle/client.lua',
  'modules/get/isInVehicle/client.lua',
  'modules/existing/network/client.lua',
}

server_scripts {
  'modules/callback/server.lua',
  'modules/version/release/server.lua',
  'modules/version/source/server.lua',
  'modules/get/closestVehicle/server.lua',
  'modules/get/isInVehicle/server.lua',
}

shared_script 'get.lua'