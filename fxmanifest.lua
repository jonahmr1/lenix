fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
repository 'https://github.com/TripplerScripts/tr_lib'
version '1.29.2'

files {
  'modules/version/server.lua',
}

shared_scripts {
  'config.lua',
  'init.lua',
  'modules/require/shared.lua',
  'modules/console/shared.lua',
  'modules/split/shared.lua',
  'modules/resources/shared.lua',
  'modules/metadata/shared.lua',
  'modules/filter/shared.lua',
  'modules/existing/instance/shared.lua',
  'modules/task/shared.lua',
  'modules/array/shared.lua',
  'modules/object/shared.lua',
  'modules/_mics/shared.lua',
}

client_scripts {
  'modules/targets/client.lua',
  'modules/callback/client.lua',
  'modules/request/client.lua',
  'modules/probe/closestEntity/shared.lua',
  'modules/probe/native/isInVehicle/client.lua',
  'modules/probe/native/isZoneClear/client.lua',
  'modules/existing/network/client.lua',
}

server_scripts {
  'modules/targets/server.lua',
  'modules/callback/server.lua',
  'modules/version/release/server.lua',
  'modules/version/source/server.lua',
  'modules/probe/native/isInVehicle/server.lua',
}