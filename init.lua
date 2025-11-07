lib = {}
--[[ require(true, 'modules/require/shared')
require(true, 'modules/load/shared')
require(true, 'modules/print/shared')
require(true, 'modules/split/shared')
require(true, 'modules/resources/shared')
require(true, 'modules/metadata/shared')
require(true, 'modules/filter/shared')
if IsDuplicityVersion() then
  require(true, 'modules/callback/server')
  require(true, 'modules/version/server')
else
  require(true, 'modules/callback/client')
end ]]