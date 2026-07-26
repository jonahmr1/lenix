---@diagnostic disable: duplicate-set-field
---@version 2.44.6

Inventory.ox_inventory.GetCurrentWeapon = {
  label = 'getCurrentWeapon',
  args = {
    { name = 'inv' }
  },
  returns = {}
}

Inventory.ox_inventory.SetStashTarget = {
  label = 'setStashTarget',
  args = {
    { name = 'id' },
    { name = 'owner' }
  },
}

---@param inv string?
---@param data any?
---@return boolean?
Inventory.ox_inventory.OpenInventory = {
  label = 'openInventory',
  args = {
    { name = 'inv' },
    { name = 'data' }
  },
  returns = {}
}

---@param data table
---@param cb fun(response: SlotWithItem | false)?
---@param noAnim? boolean
Inventory.ox_inventory.UseItem = {
  label = 'useItem',
  args = {
    { name = 'data' },
    { name = 'cb' },
    { name = 'noAnim' }
  },
}

---@param slot number
---@return boolean?
Inventory.ox_inventory.UseSlot = {
  label = 'useSlot',
  args = {
    { name = 'slot' },
    { name = 'noAnim' }
  },
}

Inventory.ox_inventory.OpenNearbyInventory = {
  label = 'openNearbyInventory',
  args = {},
  returns = {}
}

Inventory.ox_inventory.CloseInventory = {
  label = 'closeInventory',
  args = {
    { name = 'server' }
  },
}

Inventory.ox_inventory.GiveItemToTarget = {
  label = 'giveItemToTarget',
  args = {
    { name = 'serverId' },
    { name = 'slotId' },
    { name = 'count' }
  },
}

---@param search 'slots' | 1 | 'count' | 2
---@param item table | string
---@param metadata? table | string
Inventory.ox_inventory.Search = {
  label = 'Search',
  args = {
    { name = 'search' },
    { name = 'item' },
    { name = 'metadata' }
  },
  returns = {}
}

---@return ? PlayerData.inventory
Inventory.ox_inventory.GetPlayerItems = {
  label = 'GetPlayerItems',
  args = {},
  returns = {}
}

---@return ? PlayerData.weight
Inventory.ox_inventory.GetPlayerWeight = {
  label = 'GetPlayerWeight',
  args = {},
  returns = {}
}

---@return ? PlayerData.maxWeight
Inventory.ox_inventory.GetPlayerMaxWeight = {
  label = 'GetPlayerMaxWeight',
  args = {},
  returns = {}
}

---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return SlotWithItem?
Inventory.ox_inventory.GetSlotIdWithItem = {
  label = 'GetSlotIdWithItem',
  args = {
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  },
  returns = {}
}

---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return SlotWithItem[]?
Inventory.ox_inventory.GetSlotsWithItem = {
  label = 'GetSlotsWithItem',
  args = {
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  },
  returns = {}
}

---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return number
Inventory.ox_inventory.GetItemCount = {
  label = 'GetItemCount',
  args = {
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  },
  returns = {}
}

--- use array of single key value pairs to dictate order
---@param metadata string | table<string, string> | table<string, string>[]
---@param value? string
Inventory.ox_inventory.DisplayMetadata = {
  label = 'displayMetadata',
  args = {
    { name = 'metadata' },
    { name = 'value' }
  },
  returns = {}
}

---@param _ table?
---@param name string?
---@return table?
Inventory.ox_inventory.Items = {
  label = 'Items',
  args = {
    { name = '_' },
    { name = 'name' }
  },
  returns = {}
}

---@param _ table?
---@param name string?
---@return table?
Inventory.ox_inventory.ItemList = {
  label = 'ItemList',
  args = {
    { name = '_' },
    { name = 'name' }
  },
  returns = {}
}

---@param data table
Inventory.ox_inventory.Notify = {
  label = 'notify',
  args = {
    { name = 'data' }
  },
}

---@param value boolean
Inventory.ox_inventory.SuppressItemNotifications = {
  label = 'suppressItemNotifications',
  args = {
    { name = 'value' }
  },
}

---@param state boolean
Inventory.ox_inventory.WeaponWheel = {
  label = 'weaponWheel',
  args = {
    { name = 'state' }
  },
  returns = {}
}

Inventory.ox_inventory.Keyboard = {
  label = 'Keyboard',
  args = {},
  returns = {}
}

Inventory.ox_inventory.Progress = {
  label = 'Progress',
  args = {
    { name = 'options' },
    { name = 'completed' }
  },
}

Inventory.ox_inventory.CancelProgress = {
  label = 'CancelProgress',
  args = {},
}

Inventory.ox_inventory.ProgressActive = {
  label = 'ProgressActive',
  args = {},
  returns = {}
}