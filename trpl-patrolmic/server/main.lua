RegisterNetEvent('patrolmic:applySubmix', function(bool)
    TriggerClientEvent('patrolmic:updateSubmixStatus', -1, bool, source)
end)