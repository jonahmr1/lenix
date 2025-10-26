fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.9.2'

shared_scripts {
  'modules/require/shared.lua',
  'utils/require.lua',
  'modules/split/shared.lua',
  'modules/print/shared.lua',
  'modules/print/backward_compatibility.lua',
}

client_scripts {
  'modules/callback/client.lua',
}

server_scripts {
  'modules/callback/server.lua',
}