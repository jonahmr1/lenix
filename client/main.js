let isActive = false
let PlayerJob = {}

function returnVehicle(key) {
    
}

function tableFiller(...objects) {
    // Filter out null/undefined objects
    objects = objects.filter(obj => obj != null);
    
    if (objects.length === 0) return {};
    if (objects.length === 1) return { ...objects[0] };
    
    // Start with empty object
    const result = {};
    
    // Merge each object
    for (const obj of objects) {
        deepMerge(result, obj);
    }
    
    return result;
}

function deepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const sourceValue = source[key];
            const targetValue = target[key];
            
            // If both are objects (and not arrays), merge recursively
            if (
                sourceValue && 
                typeof sourceValue === 'object' && 
                !Array.isArray(sourceValue) &&
                targetValue &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)
            ) {
                target[key] = deepMerge({ ...targetValue }, sourceValue);
            } else {
                // Otherwise, override with source value
                target[key] = sourceValue;
            }
        }
    }
    
    return target;
}

onNet('QBCore:Client:OnPlayerLoaded', function() {
    QBCore.Functions.GetPlayerData(function(PlayerData) {
        PlayerJob = PlayerData.job
    })
})

onNet('QBCore:Client:OnJobUpdate', function(JobInfo) {
    PlayerJob = JobInfo
})

on('onClientResourceStart',function() {
    Citizen.CreateThread(function() {
        while (true) {
            if (QBCore && QBCore.Functions.GetPlayerData) {
                QBCore.Functions.GetPlayerData(function(PlayerData) {
                    if (PlayerData.job) {
                        PlayerJob = PlayerData.job
                    }
                })
                break
            }
        }
        Citizen.Wait(1)
    })
})