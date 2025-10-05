fx_version 'cerulean'
game 'gta5'
dependencies {
  'qb-core',
  'qb-menu',
  'qb-target'
}

description 'patrolvehicle - A QBCore resource for managing patrol vehicles in FiveM.'
version '1.0'

shared_scripts {
  'shared/*.lua'
}
client_scripts 'client/*.lua'

escrow_ingore {
  'config/*.lua'
}