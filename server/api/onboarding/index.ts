const logoutPlayer = (source: number) => {
  globalThis.exports.qbx_core.Logout(source)
  emitNet('tr_pvpmodes/client/onboarding/openMainMenu', source)
}

onNet('tr_pvpmodes/server/onboarding/logoutPlayer', () => {
  logoutPlayer(source)
})