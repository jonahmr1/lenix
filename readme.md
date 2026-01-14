# TODO
escape menub


kit types
handle failure error on ui
hiting escape return to dashboard

fix logic after convention

# Todo
## chat
unproper words blocker

# @illenium-appearance/client/framework/qb/main.lua: 89~95
## Added onSubmit and onCancel
```lua
RegisterNetEvent("qb-clothes:client:CreateFirstCharacter", function(onSubmit, onCancel)
    QBCore.Functions.GetPlayerData(function(pd)
        PlayerData = pd
        setClientParams()
        InitializeCharacter(Framework.GetGender(true), onSubmit, onCancel)
    end)
end)
```



## Setup
add_ace resource.tr_freeroam command allow

# Todo
## chat
unproper words blocker