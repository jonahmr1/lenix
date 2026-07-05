local function runHoldCommand(commandName, holdMs)
	ExecuteCommand("+" .. commandName)
	SetTimeout(holdMs or 250, function()
		ExecuteCommand("-" .. commandName)
	end)
end

CreateThread(function()
	Wait(500)
	TriggerEvent("chat:addSuggestion", "/" .. Config.ParkourCommandName, "Esegue una mossa parkour davanti a un ostacolo")
	TriggerEvent("chat:addSuggestion", "/" .. Config.SlideCommandName, "Esegue una scivolata parkour")
	TriggerEvent("chat:addSuggestion", "/parkourreset", "Sblocca il ped se una mossa parkour resta appesa")

	while true do
		Wait(0)
		if IsControlJustPressed(0, 36) then
			ClearPedTasks(PlayerPedId())
		end
	end
end)

RegisterCommand(Config.ParkourCommandName, function()
	runHoldCommand(Config.ParkourCommandName, 300)
end, false)

RegisterCommand(Config.SlideCommandName, function()
	runHoldCommand(Config.SlideCommandName, 800)
end, false)

RegisterCommand("parkourreset", function()
	local ped = PlayerPedId()

	DetachEntity(ped, true, true)
	FreezeEntityPosition(ped, false)
	ClearPedTasksImmediately(ped)
	SetPedCanRagdoll(ped, true)
	SetEntityCollision(ped, true, true)

	ParkourNotification("Parkour reset", 1)
end, false)
