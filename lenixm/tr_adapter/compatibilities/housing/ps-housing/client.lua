---@diagnostic disable: duplicate-set-field

Housing['ps-housing'].GetProperties = {
  label = 'GetProperties',
  args = {},
  returns = {}
}

Housing['ps-housing'].GetProperty = {
  label = 'GetProperty',
  args = {
    { name = 'property_id' }
  },
  returns = {}
}

Housing['ps-housing'].GetApartments = {
  label = 'GetApartments',
  args = {},
  returns = {}
}

Housing['ps-housing'].GetApartment = {
  label = 'GetApartment',
  args = {
    { name = 'apartment_id' }
  },
  returns = {}
}

Housing['ps-housing'].GetShells = {
  label = 'GetShells',
  args = {},
  returns = {}
}

Housing['ps-housing'].CreateTempShell = {
  label = 'CreateTempShell',
  args = {
    { name = 'shellName' },
    { name = 'position' },
    { name = 'rotation' },
    { name = 'leaveCb' }
  },
  returns = {}
}

Housing['ps-housing'].GetShellData = {
  label = 'GetShellData',
  args = {
    { name = 'shellName' }
  },
  returns = {}
}

Housing['ps-housing'].DespawnTempShell = {
  label = 'DespawnTempShell',
  args = {
    { name = 'shellEntity' }
  },
  returns = {}
}