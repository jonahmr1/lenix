fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
repository 'https://github.com/TripplerScripts/tr_lib'
version '2.0.0'

files {
  'modules/version/server.lua',
  'binds.json',
}

shared_scripts {
  'config.lua',
  'init.lua',
  'modules/require/shared.lua',
  'modules/console/shared.lua',
  'modules/async/shared.lua',
  'modules/split/shared.lua',
  'modules/resources/shared.lua',
  'modules/metadata/shared.lua',
  'modules/filter/shared.lua',
  'modules/existing/instance/shared.lua',
  'modules/repeat/shared.lua',
  'modules/array/shared.lua',
  'modules/object/shared.lua',
  'modules/miscellaneous/shared.lua',
  ---@deprecated
  'get.lua',
}

client_scripts {
  'modules/targets/client.lua',
  'modules/async/await/client.lua',
  'modules/async/define/client.lua',
  'modules/request/client.lua',
  'modules/probe/closestEntity/shared.lua',
  'modules/probe/native/closestVehicle/client.lua',
  'modules/probe/native/isInVehicle/client.lua',
  'modules/probe/native/isZoneClear/client.lua',
  'modules/existing/network/client.lua',
  'modules/control/client.lua',
}

server_scripts {
  'modules/targets/server.lua',
  'modules/async/await/server.lua',
  'modules/async/define/server.lua',
  'modules/version/release/server.lua',
  'modules/version/source/server.lua',
  'modules/probe/native/closestVehicle/server.lua',
  'modules/probe/native/isInVehicle/server.lua',
}