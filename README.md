# lenix_drawtext
Customizable Drawtext UI helper

## Imports
* ## Lua
### Show
```lua
exports.tr_lib:show(text, icon, key)
```
> Parameters
- text: `string`
- icon?: `string` The icon you want to show on the UI
- key?: `string` The keyboard character you want to show on the UI

### hide
```lua
exports.tr_lib:hide()
```

* ## Typescript
### Show
```ts
exports.tr_lib.show(text, icon, key)
```
> Parameters
- text: `string`
- icon?: `string` The icon you want to show on the UI
- key?: `string` The keyboard character you want to show on the UI

### hide
```ts
exports.tr_lib.hide()
```

## Notes
Notes
* The show function is automatically support multiple calls prevention, so you don't have to worry about it :)

## Config
```json
{
    "primary": "THE MAIN COLOR YOU WANT"
}
```
