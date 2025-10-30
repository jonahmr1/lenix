require(true, 'modules/require/shared')

lib = {
  print = {},
  callback = {}, 
  require = require,
}
require(true, 'modules/load/shared')
require(true, 'modules/print/shared')
require(true, 'modules/callback/client')
require(true, 'modules/callback/server')
require(true, 'modules/split/shared')

exports('require', lib.require)
return lib