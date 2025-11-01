require(true, 'modules/require/shared')

lib = {
  print = {},
  version = {},
  callback = {}, 
}

require(true, 'modules/load/shared')
require(true, 'modules/print/shared')
require(true, 'modules/split/shared')
require(true, 'modules/resources/shared')
require(true, 'modules/metadata/shared')
require(true, 'modules/filter/shared')
if IsDuplicityVersion() then
  require(true, 'modules/version/server')
  require(true, 'modules/callback/server')
else
  require(true, 'modules/callback/client')
end