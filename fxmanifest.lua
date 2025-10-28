fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.10.5'

shared_scripts {
  'init.lua',
  'modules/require/shared.lua',
  'modules/load/shared.lua',
  'modules/split/shared.lua',
  'modules/print/shared.lua',
}

client_scripts {
  'modules/callback/client.lua',
}

server_scripts {
  'modules/callback/server.lua',
}