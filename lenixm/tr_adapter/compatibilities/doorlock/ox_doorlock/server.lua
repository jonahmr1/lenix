---@diagnostic disable: duplicate-set-field

---@param door any
Doorlock.ox_doorlock.GetDoor = {
  label = 'getDoor',
  args = {
    { name = 'door' }
  },
  returns = {}
}

Doorlock.ox_doorlock.GetAllDoors = {
  label = 'getAllDoors',
  args = {},
  returns = {}
}

---@param name string
Doorlock.ox_doorlock.GetDoorFromName = {
  label = 'getDoorFromName',
  args = {
    { name = 'name' }
  },
  returns = {}
}

---@param id any
---@param data table
Doorlock.ox_doorlock.EditDoor = {
  label = 'editDoor',
  args = {
    { name = 'id' },
    { name = 'data' }
  }
}

---@param id any
---@param state any
---@param lockpick any
Doorlock.ox_doorlock.SetDoorState = {
  label = 'setDoorState',
  args = {
    { name = 'id' },
    { name = 'state' },
    { name = 'lockpick' }
  },
  returns = {}
}