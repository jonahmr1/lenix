fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'qb-core',
  'qb-menu',
  'qb-target',
  'tr_lib'
}

author 'Trippler Scripts'

client_scripts {
  'client/utils.lua',
  'client/main.lua'
}

files {
  'config/client.lua'
}

escrow_ingore {
  'config/client.lua',
}