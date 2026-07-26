---@diagnostic disable: duplicate-set-field
---@version 2.0.0

Inventory['qb-inventory'].LoadInventory = {
  label = 'LoadInventory',
  args = {
    { name = 'source' },
    { name = 'citizenid' }
  }
}

Inventory['qb-inventory'].SaveInventory = {
  label = 'SaveInventory',
  args = {
    { name = 'source' },
    { name = 'offline' }
  }
}

--- @param identifier string The identifier of the player or inventory.
--- @param items table The items to set in the inventory.
--- @param reason string The reason for setting the items.
Inventory['qb-inventory'].SetInventory = {
  label = 'SetInventory',
  args = {
    { name = 'identifier' },
    { name = 'items' },
    { name = 'reason' }
  }
}

--- @param source number The player's server ID.
--- @param itemName string The name of the item.
--- @param key string The key to set the value for.
--- @param val any The value to set for the key.
--- @param slot number (optional) The slot number of the item. If not provided, it will search by name.
--- @return boolean|nil - Returns true if the value was set successfully, false otherwise.
Inventory['qb-inventory'].SetItemData = {
  label = 'SetItemData',
  args = {
    { name = 'source' },
    { name = 'itemName' },
    { name = 'key' },
    { name = 'val' },
    { name = 'slot' }
  }
}

Inventory['qb-inventory'].UseItem = {
  label = 'UseItem',
  args = {
    { name = 'itemName' },
    { name = '...' }
  }
}

--- @param items table The table containing the items.
--- @param itemName string The name of the item to search for.
--- @return table A table containing the slots where the item was found.
Inventory['qb-inventory'].GetSlotsByItem = {
  label = 'GetSlotsByItem',
  args = {
    { name = 'items' },
    { name = 'itemName' }
  }
}

--- @param items table The table of items to search through.
--- @param itemName string The name of the item to search for.
--- @return number|nil - The slot number of the first matching item, or nil if no match is found.
Inventory['qb-inventory'].GetFirstSlotByItem = {
  label = 'GetFirstSlotByItem',
  args = {
    { name = 'items' },
    { name = 'itemName' }
  }
}

--- @param source number The player's server ID.
--- @param slot number The slot number of the item.
--- @return table|nil - item data if found, or nil if not found.
Inventory['qb-inventory'].GetItemBySlot = {
  label = 'GetItemBySlot',
  args = {
    { name = 'source' },
    { name = 'slot' }
  }
}

Inventory['qb-inventory'].GetTotalWeight = {
  label = 'GetTotalWeight',
  args = {
    { name = 'items' }
  }
}

--- @param source number - The player's server ID.
--- @param item string - The name of the item to retrieve.
--- @return table|nil - item data if found, nil otherwise.
Inventory['qb-inventory'].GetItemByName = {
  label = 'GetItemByName',
  args = {
    { name = 'source' },
    { name = 'item' }
  }
}

--- @param source number The player's server ID.
--- @param item string The name of the item to search for.
--- @return table|nil - containing the items with the specified name.
Inventory['qb-inventory'].GetTargetItems = {
  label = 'GetItemsByName',
  args = {
    { name = 'target' },
    { name = 'items' }
  },
  returns = {
    label = 'label',
    weight = 'weight',
    slot = 'slot',
    name = 'name',
    amount = 'count',
    info = 'metadata',
    shouldClose = 'close',
    unique = 'stack',
    type = 'item',
    useable = true,
    image = 'image',
    description = '',
  }
}

--- @param identifier number|string The player's identifier or the identifier of an inventory or drop.
--- @return number, number - The total count of used slots and the total count of free slots. If no inventory is found, returns 0 and the maximum slots.
Inventory['qb-inventory'].GetSlots = {
  label = 'GetSlots',
  args = {
    { name = 'identifier' }
  }
}

--- @param source number The player's source ID.
--- @param items table|string The items to count. Can be either a table of item names or a single item name.
--- @return number|nil - The total count of the specified items.
Inventory['qb-inventory'].GetItemCount = {
  label = 'GetItemCount',
  args = {
    { name = 'source' },
    { name = 'items' }
  }
}

--- @param identifier string The identifier of the player or inventory.
--- @param item string The item name.
--- @param amount number The amount of the item.
--- @return boolean - Returns true if the item can be added, false otherwise.
--- @return string|nil - Returns a string indicating the reason why the item cannot be added (e.g., 'weight' or 'slots'), or nil if it can be added.
Inventory['qb-inventory'].CanAddItem = {
  label = 'CanAddItem',
  args = {
    { name = 'identifier' },
    { name = 'item' },
    { name = 'amount' }
  }
}

--- @param source number The player's server ID.
--- @return number - Returns the free weight of the players inventory. Error will return 0
Inventory['qb-inventory'].GetFreeWeight = {
  label = 'GetFreeWeight',
  args = {
    { name = 'source' }
  }
}

Inventory['qb-inventory'].ClearInventory = {
  label = 'ClearInventory',
  args = {
    { name = 'source' },
    { name = 'filterItems' }
  }
}

--- @param items string|table - The item(s) to check for. Can be a table of items or a single item as a string.
--- @param amount number [optional] - The minimum amount required for each item. If not provided, any amount greater than 0 will be considered.
--- @return boolean - Returns true if the player has the item(s) with the specified amount, false otherwise.
Inventory['qb-inventory'].HasItem = {
  label = 'HasItem',
  args = {
    { name = 'items' },
    { name = 'amount' }
  }
}

Inventory['qb-inventory'].CloseInventory = {
  label = 'CloseInventory',
  args = {
    { name = 'source' },
    { name = 'identifier' }
  }
}

--- @param source number - The player's server ID.
--- @param targetId number - The ID of the player whose inventory will be opened.
Inventory['qb-inventory'].OpenInventoryById = {
  label = 'OpenInventoryById',
  args = {
    { name = 'source' },
    { name = 'targetId' }
  }
}

--- @param identifier string
Inventory['qb-inventory'].ClearStash = {
  label = 'ClearStash',
  args = {
    { name = 'identifier' }
  }
}

--- @param shopData table The data of the shop to create.
Inventory['qb-inventory'].CreateShop = {
  label = 'CreateShop',
  args = {
    { name = 'shopData' }
  }
}

--- @param source number The player's server ID.
--- @param name string The identifier of the inventory to open.
Inventory['qb-inventory'].OpenShop = {
  label = 'OpenShop',
  args = {
    { name = 'source' },
    { name = 'name' }
  }
}

--- @param source number The player's server ID.
--- @param identifier string|nil The identifier of the inventory to open.
--- @param data table|nil Additional data for initializing the inventory.
Inventory['qb-inventory'].OpenInventory = {
  label = 'OpenInventory',
  args = {
    { name = 'source' },
    { name = 'identifier' },
    { name = 'data' }
  }
}

--- @param identifier string The identifier of the inventory to create.
--- @param data table Additional data for initializing the inventory.
Inventory['qb-inventory'].CreateInventory = {
  label = 'CreateInventory',
  args = {
    { name = 'identifier' },
    { name = 'data' }
  }
}

--- @param identifier string The identifier of the inventory to retrieve.
--- @return table|nil - The inventory object if found, nil otherwise.
Inventory['qb-inventory'].GetInventory = {
  label = 'GetInventory',
  args = {
    { name = 'identifier' }
  }
}

--- @param identifier string The identifier of the inventory to remove.
Inventory['qb-inventory'].RemoveInventory = {
  label = 'RemoveInventory',
  args = {
    { name = 'identifier' }
  }
}

--- @param identifier string The identifier of the player or inventory.
--- @param item string The name of the item to add.
--- @param amount number The amount of the item to add.
--- @param slot number (optional) The slot to add the item to. If not provided, it will find the first available slot.
--- @param info table (optional) Additional information about the item.
--- @param reason string (optional) The reason for adding the item.
--- @return boolean Returns true if the item was successfully added, false otherwise.
Inventory['qb-inventory'].AddItem = {
  label = 'AddItem',
  args = {
    { name = 'identifier' },
    { name = 'item' },
    { name = 'amount' },
    { name = 'slot' },
    { name = 'info' },
    { name = 'reason' }
  }
}

--- @param identifier string - The identifier of the player.
--- @param item string - The name of the item to remove.
--- @param amount number - The amount of the item to remove.
--- @param slot number - The slot number of the item in the inventory. If not provided, it will find the first slot with the item.
--- @param reason string - The reason for removing the item. Defaults to 'No reason specified' if not provided.
--- @return boolean - Returns true if the item was successfully removed, false otherwise.
Inventory['qb-inventory'].RemoveItem = {
  label = 'RemoveItem',
  args = {
    { name = 'identifier' },
    { name = 'item' },
    { name = 'amount' },
    { name = 'slot' },
    { name = 'reason' }
  }
}