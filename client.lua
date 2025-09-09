local function DrawText(text, icon, key)
    SendNUIMessage({
        type = "open",
        icon = icon,
        text = text,
        key = key
    })
end

local function HideText()
    SendNUIMessage({
        type = "close",
    })
end

exports('DrawText', DrawText)
exports('HideText', HideText)