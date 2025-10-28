fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.10.4'

files {
  'init.lua',
  'modules/print/shared.lua',
  'modules/callback/client.lua',
  'modules/callback/server.lua',
  'modules/load/shared.lua',
  'modules/split/shared.lua',
  'modules/require/shared.lua',
}

shared_scripts {
  'modules/require/shared.lua',
  'init.lua',
}