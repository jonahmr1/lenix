fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.13.5'

files {
  'config.json',
  'modules/load/shared.lua',
  'modules/print/shared.lua',
  'modules/callback/client.lua',
  'modules/callback/server.lua',
  'modules/split/shared.lua',
  'modules/resources/shared.lua',
  'modules/metadata/shared.lua',
  'modules/version/server.lua',
  'get.lua',
}

shared_scripts {
  'modules/require/shared.lua',
  'init.lua'
}