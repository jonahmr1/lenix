require(true, 'modules/require/shared')

lib = {
  print = {},
  version = {},
  callback = {}, 
  require = require,
}

require(true, 'modules/load/shared')
require(true, 'modules/print/shared')
require(true, 'modules/split/shared')
require(true, 'modules/resources/shared')
require(true, 'modules/metadata/shared')
if IsDuplicityVersion() then
  require(true, 'modules/version/server')
  require(true, 'modules/callback/server')
else
  require(true, 'modules/callback/client')
end

exports('require', lib.require)