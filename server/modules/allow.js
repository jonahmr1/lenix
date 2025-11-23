function isPlayerBelongToPositionOf(targetedPosition, playerPosition) {
  if (targetedPosition == playerPosition) return true
  return false
}

function isPlayerEligableToPositionOf(targetedGrade, playerGrade) {
  if (targetedGrade <= playerGrade) return true
  return false
}

function isPlayerBelongToPositions(source, targetedPositions) {
  let isPlayerBelongToJob = false,
    isPlayerBelongToGang = false
  if (targetedPositions?.job) {
    const targetedJob = Object.entries(targetedPositions?.job)[0][0]
    const playerJob = Bridge.getPlayerJob(source).name
    isPlayerBelongToJob = isPlayerBelongToPositionOf(targetedJob, playerJob)
  }
  
  if (targetedPositions?.gang) {
    const targetedGang = Object.entries(targetedPositions?.gang)[0][0]
    const playerGang = Bridge.getPlayerGang(source).name
    isPlayerBelongToGang = isPlayerBelongToPositionOf(targetedGang, playerGang)
  }
  if (!isPlayerBelongToJob || !isPlayerBelongToGang) return false; 

  return true
}

function isPlayerGradeEligable(source, targetedJob, targetedGang) {
  let isPlayerEligableToJob = false,
    isPlayerEligableToGang = false
  if (targetedJob) {
    const targetedJobTable = Object.entries(targetedJob)[0][1]
    const targetedJobGrade = Object.values(targetedJobTable)[0]
    const playerJobGrade = Bridge.getPlayerJob(source).grade
    isPlayerEligableToJob = isPlayerEligableToPositionOf(targetedJobGrade, playerJobGrade)
  }
  if (targetedGang) {
    const targetedGangTable = Object.entries(targetedGang)[0][1]
    const targetedGangGrade = Object.values(targetedGangTable)[0]
    const playerGangGrade = Bridge.getPlayerGang(source).grade
    isPlayerEligableToGang = isPlayerEligableToPositionOf(targetedGangGrade, playerGangGrade)
  }

  if (isPlayerEligableToJob || isPlayerEligableToGang) return true; 

  return false
}

function playerInPositionOf(source, targetedPositions) {
  if (isPlayerBelongToPositions(source, targetedPositions)) return true;

  if (isPlayerGradeEligable(source, targetedPositions)) return true;

  return false
}

lib.callback.register('isPlayerInAllowList', function(source, allowedTargets) {
  if (Object.keys(allowedTargets).length === 0) return true
  return playerInPositionOf(source, allowedTargets)
})

lib.callback.register('isPlayerNotInDisallowedList', function(source, disallowedTargets) {
  if (Object.keys(disallowedTargets).length === 0) return true
  return !playerInPositionOf(source, disallowedTargets)
})