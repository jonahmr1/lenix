---@diagnostic disable: duplicate-set-field
---@version 2.44.6

---@param player table
---@param data table?
Inventory.ox_inventory.SetPlayerInventory = {
  label = 'SetPlayerInventory',
  args = {
    { name = 'player' },
    { name = 'data' }
  }
}

---@param playerId number
---@param invType string
---@param data string|number|table
Inventory.ox_inventory.ForceOpenInventory = {
  label = 'ForceOpenInventory',
  args = {
    { name = 'playerId' },
    { name = 'invType' },
    { name = 'data' }
  }
}

Inventory.ox_inventory.ConvertItems = {
  label = 'ConvertItems',
  args = {
    { name = 'playerId' },
    { name = 'items' }
  }
}

Inventory.ox_inventory.RegisterHook = {
  label = 'RegisterHook',
  args = {
    { name = 'event' },
    { name = 'cb' },
    { name = 'options' }
  }
}

Inventory.ox_inventory.RemoveHooks = {
  label = 'RemoveHooks',
  args = {
    { name = 'id' }
  }
}

---@param inv inventory
---@param owner? string | number
Inventory.ox_inventory.Inventory = {
  label = 'Inventory',
  args = {
    { name = 'inv' },
    { name = 'owner' }
  }
}

---@param inv inventory
---@param owner? string | number
Inventory.ox_inventory.GetInventory = {
  label = 'GetInventory',
  args = {
    { name = 'inv' },
    { name = 'owner' }
  }
}

---@param inv inventory
---@param owner? string | number
---@return table?
Inventory.ox_inventory.GetInventoryItems = {
  label = 'GetInventoryItems',
  args = {
    { name = 'inv' },
    { name = 'owner' }
  }
}

---@param inv inventory
---@param slotId number
---@return OxInventory?
Inventory.ox_inventory.GetContainerFromSlot = {
  label = 'GetContainerFromSlot',
  args = {
    { name = 'inv' },
    { name = 'slotId' }
  }
}

---@param inv inventory
Inventory.ox_inventory.RemoveInventory = {
  label = 'RemoveInventory',
  args = {
    { name = 'inv' }
  }
}

---@param oldPlate string
---@param newPlate string
Inventory.ox_inventory.UpdateVehicle = {
  label = 'UpdateVehicle',
  args = {
    { name = 'oldPlate' },
    { name = 'newPlate' }
  }
}

---@param inv inventory
---@param item table | string
---@param metadata? any
---@param returnsCount? boolean
---@return table | number | nil
Inventory.ox_inventory.GetItem = {
  label = 'GetItem',
  args = {
    { name = 'inv' },
    { name = 'item' },
    { name = 'metadata' },
    { name = 'returnsCount' }
  }
}

---@param fromInventory any
---@param toInventory any
---@param slot1 number
---@param slot2 number
Inventory.ox_inventory.SwapSlots = {
  label = 'SwapSlots',
  args = {
    { name = 'fromInventory' },
    { name = 'toInventory' },
    { name = 'slot1' },
    { name = 'slot2' }
  }
}

---@param inv inventory
---@param item table | string
---@param count number
---@param metadata? table
---@return boolean? success, string|SlotWithItem|nil response
Inventory.ox_inventory.SetItem = {
  label = 'SetItem',
  args = {
    { name = 'inv' },
    { name = 'item' },
    { name = 'count' },
    { name = 'metadata' }
  },
}

---@param inv inventory
Inventory.ox_inventory.GetCurrentWeapon = {
  label = 'GetCurrentWeapon',
  args = {
    { name = 'inv' }
  }
}

---@param inv inventory
---@param slotId number
---@return table? item
Inventory.ox_inventory.GetSlot = {
  label = 'GetSlot',
  args = {
    { name = 'target' },
    { name = 'slotId' }
  },
}

---@param inv inventory
---@param slotId number
---@param durability number
Inventory.ox_inventory.SetDurability = {
  label = 'SetDurability',
  args = {
    { name = 'inv' },
    { name = 'slotId' },
    { name = 'durability' }
  }
}

---@param inv inventory
---@param slotId number
---@param metadata { [string]: any }
Inventory.ox_inventory.SetMetadata = {
  label = 'SetMetadata',
  args = {
    { name = 'inv' },
    { name = 'slotId' },
    { name = 'metadata' }
  }
}

---@param inv inventory
---@param slots number
Inventory.ox_inventory.SetSlotCount = {
  label = 'SetSlotCount',
  args = {
    { name = 'inv' },
    { name = 'slots' }
  }
}

---@param inv inventory
---@param maxWeight number
Inventory.ox_inventory.SetMaxWeight = {
  label = 'SetMaxWeight',
  args = {
    { name = 'inv' },
    { name = 'maxWeight' }
  }
}

---@param inv inventory
---@param item table | string
---@param count number
---@param metadata? table | string
---@param slot? number
---@param cb? fun(success?: boolean, response: string|SlotWithItem|nil)
---@return boolean? success, string|SlotWithItem|nil response
Inventory.ox_inventory.AddItem = {
  label = 'AddItem',
  args = {
    { name = 'inv' },
    { name = 'item' },
    { name = 'count' },
    { name = 'metadata' },
    { name = 'slot' },
    { name = 'cb' }
  },
}

---@param inv inventory
---@param search string|number slots|1, count|2
---@param items table | string
---@param metadata? table | string
Inventory.ox_inventory.GetTargetItems = {
  label = 'Search',
  args = {
    { name = 'target' },
    { name = 'type', defaultValue = 1 },
    { name = 'items' },
    { name = 'metadata' }
  },
  returns = {
    name = 'name',
    weight = 'weight',
    label = 'label',
    slot = 'slot',
    metadata = 'info',
    count = 'amount',
    close = 'shouldClose',
    stack = 'unique'
  }
}

---@param inv inventory
---@param item table | string
---@param metadata? table
---@param strict? boolean
Inventory.ox_inventory.GetItemSlots = {
  label = 'GetItemSlots',
  args = {
    { name = 'inv' },
    { name = 'item' },
    { name = 'metadata' },
    { name = 'strict' }
  }
}

---@param inv inventory
---@param item table | string
---@param count integer
---@param metadata? table | string
---@param slot? number
---@param ignoreTotal? boolean
---@param strict? boolean
---@return boolean? success, string? response
Inventory.ox_inventory.RemoveItem = {
  label = 'RemoveItem',
  args = {
    { name = 'inv' },
    { name = 'item' },
    { name = 'count' },
    { name = 'metadata' },
    { name = 'slot' },
    { name = 'ignoreTotal' },
    { name = 'strict' }
  },
}

---@param inv inventory
---@param item table | string
---@param count number
---@param metadata? table | string
Inventory.ox_inventory.CanCarryItem = {
  label = 'CanCarryItem',
  args = {
    { name = 'inv' },
    { name = 'item' },
    { name = 'count' },
    { name = 'metadata' }
  }
}

---@param inv inventory
---@param item table | string
Inventory.ox_inventory.CanCarryAmount = {
  label = 'CanCarryAmount',
  args = {
    { name = 'inv' },
    { name = 'item' }
  }
}

---@param inv inventory
---@param weight number
Inventory.ox_inventory.CanCarryWeight = {
  label = 'CanCarryWeight',
  args = {
    { name = 'inv' },
    { name = 'weight' }
  }
}

---@param inv inventory
---@param firstItem string
---@param firstItemCount number
---@param testItem string
---@param testItemCount number
Inventory.ox_inventory.CanSwapItem = {
  label = 'CanSwapItem',
  args = {
    { name = 'inv' },
    { name = 'firstItem' },
    { name = 'firstItemCount' },
    { name = 'testItem' },
    { name = 'testItemCount' }
  }
}

Inventory.ox_inventory.CustomDrop = {
  label = 'CustomDrop',
  args = {
    { name = 'prefix' },
    { name = 'items' },
    { name = 'coords' },
    { name = 'slots' },
    { name = 'maxWeight' },
    { name = 'instance' },
    { name = 'model' }
  }
}

Inventory.ox_inventory.CreateDropFromPlayer = {
  label = 'CreateDropFromPlayer',
  args = {
    { name = 'playerId' }
  }
}

Inventory.ox_inventory.ConfiscateInventory = {
  label = 'ConfiscateInventory',
  args = {
    { name = 'source' }
  }
}

Inventory.ox_inventory.ReturnInventory = {
  label = 'ReturnInventory',
  args = {
    { name = 'source' }
  }
}

---@param inv inventory
---@param keep? string | string[] an item or list of items to ignore while clearing items
Inventory.ox_inventory.ClearInventory = {
  label = 'ClearInventory',
  args = {
    { name = 'inv' },
    { name = 'keep' }
  }
}

---@param inv inventory
---@return integer?
Inventory.ox_inventory.GetEmptySlot = {
  label = 'GetEmptySlot',
  args = {
    { name = 'inv' }
  }
}

---@param inv inventory
---@param itemName string
---@param metadata any
Inventory.ox_inventory.GetSlotForItem = {
  label = 'GetSlotForItem',
  args = {
    { name = 'inv' },
    { name = 'itemName' },
    { name = 'metadata' }
  }
}

---@param inv inventory
---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return number?
Inventory.ox_inventory.GetSlotIdWithItem = {
  label = 'GetSlotIdWithItem',
  args = {
    { name = 'inv' },
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  }
}

---@param inv inventory
---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return SlotWithItem[]?
Inventory.ox_inventory.GetSlotsWithItem = {
  label = 'GetSlotsWithItem',
  args = {
    { name = 'inv' },
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  }
}

---@param inv inventory
---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return number[]?
Inventory.ox_inventory.GetSlotIdsWithItem = {
  label = 'GetSlotIdsWithItem',
  args = {
    { name = 'inv' },
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  }
}

---@param inv inventory
---@param itemName string
---@param metadata? any
---@param strict? boolean Strictly match metadata properties, otherwise use partial matching.
---@return number
Inventory.ox_inventory.GetItemCount = {
  label = 'GetItemCount',
  args = {
    { name = 'inv' },
    { name = 'itemName' },
    { name = 'metadata' },
    { name = 'strict' }
  }
}

---@param name string stash identifier when loading from the database
---@param label string display name when inventory is open
---@param slots number
---@param maxWeight number
---@param owner? string|number|boolean
---@param groups? table<string, number>
---@param coords? vector3|table<vector3>
Inventory.ox_inventory.RegisterStash = {
  label = 'RegisterStash',
  args = {
    { name = 'name' },
    { name = 'label' },
    { name = 'slots' },
    { name = 'maxWeight' },
    { name = 'owner' },
    { name = 'groups' },
    { name = 'coords' }
  }
}

---@param properties TemporaryStashProperties
Inventory.ox_inventory.CreateTemporaryStash = {
  label = 'CreateTemporaryStash',
  args = {
    { name = 'properties' }
  }
}

Inventory.ox_inventory.InspectInventory = {
  label = 'InspectInventory',
  args = {
    { name = 'playerId' },
    { name = 'invId' }
  }
}

---@param _ table?
---@param name string?
---@return table?
Inventory.ox_inventory.Items = {
  label = 'Items',
  args = {
    { name = '_' },
    { name = 'name' }
  }
}

---@param _ table?
---@param name string?
---@return table?
Inventory.ox_inventory.ItemList = {
  label = 'ItemList',
  args = {
    { name = '_' },
    { name = 'name' }
  }
}

---@param source number
---@param amount number
Inventory.ox_inventory.AddCash = {
  label = 'AddCash',
  args = {
    { name = 'source' },
    { name = 'amount' }
  }
}

---@param source number
---@param amount number
Inventory.ox_inventory.RemoveCash = {
  label = 'RemoveCash',
  args = {
    { name = 'source' },
    { name = 'amount' }
  }
}

---@param source number
---@return number
Inventory.ox_inventory.GetCash = {
  label = 'GetCash',
  args = {
    { name = 'source' }
  }
}

---@param source number
---@return table?
Inventory.ox_inventory.GetCards = {
  label = 'GetCards',
  args = {
    { name = 'source' }
  }
}

---@param source number
---@param card table
Inventory.ox_inventory.GiveCard = {
  label = 'GiveCard',
  args = {
    { name = 'source' },
    { name = 'card' }
  }
}

---@param shopType string
---@param shopDetails OxShop
Inventory.ox_inventory.RegisterShop = {
  label = 'RegisterShop',
  args = {
    { name = 'shopType' },
    { name = 'shopDetails' }
  }
}