import { sleep, waitFor } from '@overextended/ox_lib';
import { cache, inputDialog, registerContext, requestModel, showContext } from '@overextended/ox_lib/client';
import { OxPlayer } from './player';
import { netEvent } from 'utils';
import { CHARACTER_SELECT, CHARACTER_SLOTS, SPAWN_LOCATION } from 'config';
import locale from '../common/locales';
import type { Character, NewCharacter } from 'types';

DoScreenFadeOut(0);
NetworkStartSoloTutorialSession();
setTimeout(() => emitNet('ox:playerJoined'));

async function StartSession() {
	if (IsPlayerSwitchInProgress()) {
		StopPlayerSwitch();
	}

	if (GetIsLoadingScreenActive()) {
		SendLoadingScreenMessage('{"fullyLoaded": true}');
		ShutdownLoadingScreenNui();
	}

	NetworkStartSoloTutorialSession();
	DoScreenFadeOut(0);
	ShutdownLoadingScreen();
	SetPlayerControl(cache.playerId, false, 0);
	SetPlayerInvincible(cache.playerId, true);

	while (!OxPlayer.isLoaded) {
		DisableAllControlActions(0);
		ThefeedHideThisFrame();
		HideHudAndRadarThisFrame();

		await sleep(0);
	}

	NetworkEndTutorialSession();
	SetPlayerControl(cache.playerId, true, 0);
	SetPlayerInvincible(cache.playerId, false);
	SetMaxWantedLevel(0);
	NetworkSetFriendlyFireOption(true);
	SetPlayerHealthRechargeMultiplier(cache.playerId, 0.0);
}

async function promptCharacterMenu(characters: Character[]): Promise<Character | undefined> {
	return new Promise((resolve) => {
		registerContext({
			id: 'char_selection',
			title: 'Character Selection',
			canClose: false,
			options: [
				...characters.map(character => ({
					title: `${character.firstName} ${character.lastName}`,
					metadata: [
						{ label: locale('gender'), value: locale(character.gender as any) },
						{ label: locale('last_played'), value: character.lastPlayed },
					],
					onSelect: () => resolve(character)
				})),
				{
					title: locale('create_character'),
					disabled: characters.length >= CHARACTER_SLOTS,
					onSelect: () => resolve(undefined)
				},
			]
		})

		showContext('char_selection')
	})
}

const charSelect = async (characters: Character[]) => {
	const pedsCoords: [number, number, number, number][] = [
		[-2167.1487, 1134.3087, -25.3712, 272.6151],
		[-2167.1431, 1137.5076, -25.3712, 269.0276]
	]

	const peds: number[] = []

	for (const coords of pedsCoords) {
		const hash = await requestModel('mp_m_freemode_01')
		const ped = CreatePed(0, hash, ...coords, false, false)
		SetEntityAlpha(ped, 200, false)
		FreezeEntityPosition(ped, true)
		SetEntityInvincible(ped, true)
		SetBlockingOfNonTemporaryEvents(ped, true)
		peds.push(ped)
	}

	const camCoords = [-2161.7, 1136.4, -23.77, 92.52]
	const cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
	SetCamCoord(cam, camCoords[0], camCoords[1], camCoords[2])
	SetCamRot(cam, 0.0, 0.0, camCoords[3], 2)
	SetCamActive(cam, true)
	RenderScriptCams(true, false, 0, true, false)

	SetEntityCoords(cache.ped, camCoords[0], camCoords[1], camCoords[2], false, false, false, false)

	const tick = setTick(() => {
		if (!IsControlJustPressed(0, 24)) return // left mouse click

		const camPos = GetCamCoord(cam) as unknown as [number, number, number]
		const camRot = GetCamRot(cam, 2) as unknown as [number, number, number]

		// convert rotation to forward direction vector
		const rotX = camRot[0] * (Math.PI / 180)
		const rotZ = camRot[2] * (Math.PI / 180)
		const forward = [
			-Math.sin(rotZ) * Math.cos(rotX),
			Math.cos(rotZ) * Math.cos(rotX),
			Math.sin(rotX),
		] as [number, number, number]

		const farPoint: [number, number, number] = [
			camPos[0] + forward[0] * 50,
			camPos[1] + forward[1] * 50,
			camPos[2] + forward[2] * 50,
		]

		const ray = StartShapeTestRay(
			camPos[0], camPos[1], camPos[2],
			farPoint[0], farPoint[1], farPoint[2],
			-1, 0, 0
		)
		const [, hit, , , entity] = GetShapeTestResult(ray)

		if (!hit) return

		const index = peds.indexOf(entity)
		if (index === -1) return

		console.debug('clicked ped at slot', index)
	})

	DoScreenFadeIn(1000)

	on('onResourceStop', () => {
		peds.forEach(ped => {
			DeletePed(ped)
		});
	})



	// RenderScriptCams(false, false, 0, true, false)
	// DestroyCam(cam, false)

	// DoScreenFadeOut(100);
}

netEvent('ox:startCharacterSelect', async (_userId: number, characters: Character[]) => {
	if (OxPlayer.isLoaded) {
		OxPlayer.isLoaded = false;

		emit('ox:playerLogout');
	}

	StartSession();

	if (!CHARACTER_SELECT) return;

	const character = await charSelect(characters);
	return
	const [x, y, z] = [
		character?.x || SPAWN_LOCATION[0],
		character?.y || SPAWN_LOCATION[1],
		character?.z || SPAWN_LOCATION[2],
	];
	const heading = character?.heading || SPAWN_LOCATION[3];

	RequestCollisionAtCoord(x, y, z);
	FreezeEntityPosition(cache.ped, true);
	SetEntityCoordsNoOffset(cache.ped, x, y, z, true, true, false);
	SetEntityHeading(cache.ped, heading);

	SwitchOutPlayer(cache.ped, 1 | 8192, 1);

	while (GetPlayerSwitchState() !== 5) await sleep(0);

	DoScreenFadeIn(200);

	if (character) {
		return emitNet('ox:setActiveCharacter', character.charId);
	}

	const input = await inputDialog(
		locale('create_character'),
		[
			{
				type: 'input',
				required: true,
				icon: 'user-pen',
				label: locale('firstname'),
				placeholder: 'John',
			},
			{
				type: 'input',
				required: true,
				icon: 'user-pen',
				label: locale('lastname'),
				placeholder: 'Smith',
			},
			{
				type: 'select',
				required: true,
				icon: 'circle-user',
				label: locale('gender'),
				options: [
					{
						label: locale('male'),
						value: 'male',
					},
					{
						label: locale('female'),
						value: 'female',
					},
					{
						label: locale('non_binary'),
						value: 'non_binary',
					},
				],
			},
			{
				type: 'date',
				required: true,
				icon: 'calendar-days',
				label: locale('date_of_birth'),
				format: 'YYYY-MM-DD',
				min: '1900-01-01',
				max: '2006-01-01',
				default: '2006-01-01',
			},
		],
		{
			allowCancel: false,
		},
	);

	if (!input) return;

	emitNet('ox:setActiveCharacter', <NewCharacter>{
		firstName: input[0] as string,
		lastName: input[1] as string,
		gender: input[2] as string,
		date: input[3] as number,
	});
});

netEvent('ox:setActiveCharacter', async (character: Character) => {
	if (CHARACTER_SELECT) {
		SwitchInPlayer(PlayerPedId());
		SetGameplayCamRelativeHeading(0);
	}

	await waitFor(() => (IsScreenFadedIn() && !IsPlayerSwitchInProgress() ? true : undefined), '', 0);

	SetEntityHealth(cache.ped, character.health ?? GetEntityMaxHealth(cache.ped));
	SetPedArmour(cache.ped, character.armour ?? 0);
	FreezeEntityPosition(cache.ped, false);

	OxPlayer.isLoaded = true;

	emit('playerSpawned');
	emit('ox:playerLoaded', OxPlayer, character.isNew);
});
