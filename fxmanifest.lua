fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
repository 'https://github.com/TripplerScripts/tr_lib'
version '2.9.7'

files {
  'imports/version/server.lua',
  'binds.json',
}

shared_scripts {
  'config.lua',
  'index.lua',
  'imports/require/shared.lua',
  'imports/console/shared.lua',
  'imports/promise/shared.lua',
  'imports/split/shared.lua',
  'imports/resources/shared.lua',
  'imports/metadata/shared.lua',
  'imports/filter/shared.lua',
  'imports/existing/instance/shared.lua',
  'imports/repeat/shared.lua',
  'imports/array/shared.lua',
  'imports/object/shared.lua',
  'imports/miscellaneous/shared.lua',
  ---@deprecated
  'get.lua',
}

client_scripts {
  'imports/players/client.lua',
  'imports/promise/await/client.lua',
  'imports/promise/on/client.lua',
  'imports/request/client.lua',
  'imports/probe/closestEntity/shared.lua',
  'imports/probe/native/closestVehicle/client.lua',
  'imports/probe/native/isInVehicle/client.lua',
  'imports/probe/native/isZoneClear/client.lua',
  'imports/existing/network/client.lua',
  'imports/control/client.lua',
}

server_scripts {
  'imports/players/server.lua',
  'imports/promise/await/server.lua',
  'imports/promise/on/server.lua',
  'imports/version/release/server.lua',
  'imports/version/source/server.lua',
  'imports/probe/native/closestVehicle/server.lua',
  'imports/probe/native/isInVehicle/server.lua',
}