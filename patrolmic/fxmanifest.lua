fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'https://forum.cfx.re/u/lenix_x/summary'
description 'An enhanced script that make the game more realistic when a patrol hit the mic button to speak to the outside of the car'
version '1.0.0'

client_script 'client/*.lua'

shared_scripts {
    'config/*.lua',
    'shared/*.lua'
}

server_script 'server/*.lua'

dependency 'pma-voice'