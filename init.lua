require(true, 'modules/require/shared')

lib = {
  print = {},
  version = {},
  callback = {}, 
  require = require,
}

require(true, 'modules/load/shared')
require(true, 'modules/print/shared')
require(true, 'modules/callback/client')
require(true, 'modules/callback/server')
require(true, 'modules/split/shared')
require(true, 'modules/resources/shared')
require(true, 'modules/metadata/shared')
require(true, 'modules/version/server')

exports('require', lib.require)
return lib