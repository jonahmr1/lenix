import { cache, disableRadial, notify, requestAnimDict, skillCheck, sleep } from "@overextended/ox_lib/client"
import type { Vector3 } from ".."
import { getClosestPlayer } from "../closest";

let isCuffed = false;

const anims = [
	{ dict: 'mp_arresting', anim: 'idle' },
	{ dict: 'mp_arrest_paired', anim: 'crook_p2_back_right' },
];

const ALLOWED_CONTROLS = new Set([
	0,  // INPUT_NEXT_CAMERA
	1,  // INPUT_LOOK_LR
	2,  // INPUT_LOOK_UD
	3,  // INPUT_LOOK_UP_ONLY
	4,  // INPUT_LOOK_DOWN_ONLY
	5,  // INPUT_LOOK_LEFT_ONLY
	6,  // INPUT_LOOK_RIGHT_ONLY
	21, // INPUT_SPRINT
	30, // INPUT_MOVE_LR
	31, // INPUT_MOVE_UD
	32, // INPUT_MOVE_UP_ONLY
	33, // INPUT_MOVE_DOWN_ONLY
	34, // INPUT_MOVE_LEFT_ONLY
	35, // INPUT_MOVE_RIGHT_ONLY
	218, // INPUT_SCRIPT_LEFT_AXIS_X
	219, // INPUT_SCRIPT_LEFT_AXIS_Y
	220, // INPUT_SCRIPT_RIGHT_AXIS_X
	221, // INPUT_SCRIPT_RIGHT_AXIS_Y
	245, // INPUT_MP_TEXT_CHAT_ALL
	266, // INPUT_MOVE_LEFT
	267, // INPUT_MOVE_RIGHT
	268, // INPUT_MOVE_UP
	269, // INPUT_MOVE_DOWN
	270, // INPUT_LOOK_LEFT
	271, // INPUT_LOOK_RIGHT
	272, // INPUT_LOOK_UP
	273, // INPUT_LOOK_DOWN
]);

const handCuffAnimation = async () => {
	requestAnimDict('mp_arrest_paired');
	await sleep(100);

	TaskPlayAnim(cache.ped, 'mp_arrest_paired', 'cop_p2_back_right', 3.0, 3.0, -1, 48, 0, false, false, false);

	await sleep(3500);

	TaskPlayAnim(cache.ped, 'mp_arrest_paired', 'exit', 3.0, 3.0, -1, 48, 0, false, false, false);
	RemoveAnimDict('mp_arrest_paired');
}

const getCuffedAnimation = async (playerId: number) => {
	const cuffer = GetPlayerPed(GetPlayerFromServerId(playerId));
	const heading = GetEntityHeading(cuffer);

	requestAnimDict('mp_arrest_paired');

	const offset = GetOffsetFromEntityInWorldCoords(cuffer, 0.0, 0.45, 0.0) as Vector3
	SetEntityCoords(cache.ped, offset[0], offset[1], offset[2], true, false, false, false);

	await sleep(100);

	SetEntityHeading(cache.ped, heading);
	TaskPlayAnim(cache.ped, 'mp_arrest_paired', 'crook_p2_back_right', 3.0, 3.0, -1, 32, 0, false, false, false);

	await sleep(2500);

	RemoveAnimDict('mp_arrest_paired');
}

export const setCuffs = () => {
	if (!isCuffed) return;

	DisableAllControlActions(0)
	for (const control of ALLOWED_CONTROLS) {
		EnableControlAction(0, control, true)
	}

	for (const anim of anims) {
		if (IsEntityPlayingAnim(cache.ped, anim.dict, anim.anim, 3)) return;
	}

	requestAnimDict('mp_arresting');
	TaskPlayAnim(cache.ped, 'mp_arresting', 'idle', 8.0, -8.0, -1, 48, 0, false, false, false);
};

onNet('ox:client:cuffPlayer', () => {
	const nearest = getClosestPlayer(GetEntityCoords(cache.ped, false) as Vector3)
	if (!nearest.playerId) {
		notify({
			title: 'No one nearby!'
		})
		return
	}
	emitNet('ox:server:toggleCuffs', GetPlayerServerId(nearest.playerId))
	handCuffAnimation()
})

onNet('ox:client:toggleCuffs', async (cuffer: number, state: boolean) => {
	isCuffed = state
	disableRadial(state)
	exports.ox_target.disableTargeting(state)
	if (state) {
		getCuffedAnimation(cuffer);
		const res = await skillCheck('easy');
		if (!res) {
			notify({ title: 'Failed' })
			return
		}

		emitNet('ox:server:toggleCuffs', cache.serverId)
	} else {
		ClearPedTasks(cache.ped);
		RemoveAnimDict('mp_arresting');
	}
});
