Config = {}

discord = {
    ['webhook'] = Config.Webhook,
    ['name'] = Config.BotName,
    ['image'] = Config.BotImage
}

function DiscordLog(name, message, color)
    local embed = {
        {
            ["color"] = Config.EmbedColor, 
            ["title"] = Config.EmbedTitle,
            ["description"] = message,
            ["url"] = Config.DiscordLink,
            ["footer"] = {
                ["text"] = Config.EmbedFooterName,
                ["icon_url"] = Config.EmbedFooterImage
            },
            ["thumbnail"] = {
                ["url"] = Config.EmbedThumbainlImage,
            },
        }
    }
    if Config.LogEnabled then
        PerformHttpRequest(discord['webhook'], function(err, text, headers) end, 'POST', json.encode({username = discord['name'], embeds = embed, avatar_url = discord['image']}), { ['Content-Type'] = 'application/json' })
    end
end