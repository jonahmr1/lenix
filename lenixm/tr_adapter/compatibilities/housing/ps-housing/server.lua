---@diagnostic disable: duplicate-set-field

Housing['ps-housing'].GetMainDoor = {
  label = 'getMainDoor',
  args = {
    { name = 'propertyId' },
    { name = 'doorIndex' },
    { name = 'isShell' }
  },
  returns = {}
}

Housing['ps-housing'].RegisterProperty = {
  label = 'registerProperty',
  args = {
    { name = 'propertyData' },
    { name = 'preventEnter' },
    { name = 'source' }
  },
  returns = {}
}

Housing['ps-housing'].IsOwner = {
  label = 'IsOwner',
  args = {
    { name = 'src' },
    { name = 'property_id' }
  },
  returns = {}
}

Housing['ps-housing'].GetProperties = {
  label = 'GetProperties',
  args = {},
  returns = {}
}

Housing['ps-housing'].GetApartments = {
  label = 'GetApartments',
  args = {},
  returns = {}
}