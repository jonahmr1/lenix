import { cache } from "@overextended/ox_lib";
import type { Vector3 } from "..";

export const getClosestPlayer = (
  coords: Vector3,
  maxDistance = 2.0,
  includePlayer = false
): {
  playerId?: number;
  playerPed?: number;
  playerCoords?: Vector3;
  playerVehicle?: number;
} => {
  const players = GetActivePlayers();

  let closestId: number | undefined;
  let closestPed: number | undefined;
  let closestCoords: Vector3 | undefined;
  let closestVehicle: number | undefined;

  for (let i = 0; i < players.length; i++) {
    const playerId = players[i];

    if (playerId !== cache.playerId || includePlayer) {
      const playerPed = GetPlayerPed(playerId);
      const vehicle = GetVehiclePedIsIn(playerPed, false);
      const playerCoords =
        (vehicle === 0
          ? GetEntityCoords(playerPed, false)
          : GetWorldPositionOfEntityBone(playerPed, 0)) as Vector3

      const distance = Vdist(
        coords[0],
        coords[1],
        coords[2],
        playerCoords[0],
        playerCoords[1],
        playerCoords[2]
      );

      if (distance < maxDistance) {
        maxDistance = distance;
        closestId = playerId;
        closestPed = playerPed;
        closestCoords = playerCoords;
        closestVehicle = vehicle;
      }
    }
  }

  return { playerId: closestId, playerPed: closestPed, playerCoords: closestCoords, playerVehicle: closestVehicle };
}
