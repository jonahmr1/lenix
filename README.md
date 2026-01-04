# lenix_drawtext
Customizable Drawtext UI helper

## About
### Introoduction
Welcome to Draw Text.

This script is designed to enhance your server's gameplay by:
* Light weight UI design that comes with configurations

### Instructions
* Installation: drag and drop
* Environment: standalone
* Support: available

> Enjoy your improved gaming experience with Draw Text!

<img width="339" height="57" alt="drawtext" src="https://github.com/user-attachments/assets/41b35f65-3ff0-465d-9ec5-d6883953e622" />

## Imports
* ## Lua
### Show
```lua
exports.lenix_drawtext:show(text, icon, key)
```
> Parameters
- text: `string`
- icon?: `string` The icon you want to show on the UI
- key?: `string` The keyboard character you want to show on the UI

### hide
```lua
exports.lenix_drawtext:hide()
```

* ## Typescript
### Show
```ts
exports.lenix_drawtext.show(text, icon, key)
```
> Parameters
- text: `string`
- icon?: `string` The icon you want to show on the UI
- key?: `string` The keyboard character you want to show on the UI

### hide
```ts
exports.lenix_drawtext.hide()
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
