### Add to ox_target/client/defaults.lua#L18
```lua
	if GetEntityModel(vehicle) == joaat('stockade') and (door == 2 or door == 3) then return end
```
### Add to ox_inventory/modules/inventory/client.lua#55
```lua
	if GetEntityModel(entity) == joaat('stockade') then return end
```