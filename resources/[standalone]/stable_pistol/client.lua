local stableWeapons = {
	[`WEAPON_PISTOL`] = true,
	[`WEAPON_PISTOL50`] = true,
}

CreateThread(function()
	local lastPitch = 0.0

	while true do
		local sleep = 250
		local ped = PlayerPedId()
		local weapon = GetSelectedPedWeapon(ped)

		if stableWeapons[weapon] then
			sleep = 0

			if IsPedShooting(ped) then
				SetGameplayCamRelativePitch(lastPitch, 1.0)
			else
				lastPitch = GetGameplayCamRelativePitch()
			end
		end

		Wait(sleep)
	end
end)
