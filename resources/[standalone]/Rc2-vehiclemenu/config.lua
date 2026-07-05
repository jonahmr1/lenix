Config = {
    Debug = false,
    CommandName = "vehiclemenu",
    Keybind = {
        enabled = false,
        key = "END" -- The Key to opening the menu if enabled.
    },
    Translation = {
    ["tip_focus_mode"] = "Tip : right click to enter focus mode.",
    ["tab_windows"] = "windows",
    ["tab_seats"] = "seats",
    ["tab_miscellaneous"] = "miscellaneous",
    ["tab_doors"] = "doors",
 }
}

Functions = {
    HasKeys = function()
        return true
    end
}
