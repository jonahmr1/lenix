import { nuiFocus, triggerNuiCallback } from "@trippler/tr_lib/nui"
import { DepartmentData, ServerRanks, UpdateReputationObject, FirePlayerObject, HirePlayerObject, ManageFundsObject, TransferFundsObject, UpdateDataCB } from "../../../shared/types"

let players: Awaited<UpdateDataCB["players"]>
let departmentData: DepartmentData = { budget: 0, totalPlayers: 0, activePlayers: 0 }

function showForm(formName: unknown) {
  document.querySelectorAll('.form-section').forEach(f => f.classList.remove('active'))
  document.getElementById(formName + 'Form')?.classList.add('active')
}

function submitHire() {
  const hireName = (document.getElementById('hireName') as HTMLInputElement)?.value
  const hireRank = (document.getElementById('hireRank') as HTMLSelectElement)?.value
  const hireCallsign = (document.getElementById('hireCallsign') as HTMLInputElement)?.value

  if (!hireName || !hireRank || !hireCallsign) {
    showNotification('Please fill in all fields!', 'error')
    return
  }

  const data = {
    citizenid: hireName,
    rank: hireRank,
    callsign: parseInt(hireCallsign)
  } satisfies HirePlayerObject

  triggerNuiCallback('hirePlayer', data)
}

function submitFire() {
  const firePlayer = (document.getElementById('firePlayer') as HTMLSelectElement)?.value
  const fireReason = (document.getElementById('fireReason') as HTMLSelectElement)?.value

  if (!firePlayer || firePlayer === "") {
    showNotification('Please select an player!', 'error')
    return
  }

  if (!fireReason || fireReason === "") {
    showNotification('Please select a reason!', 'error')
    return
  }

  const data = {
    citizenid: firePlayer,
    reason: fireReason
  } satisfies FirePlayerObject

  triggerNuiCallback('firePlayer', data)
}

function submitReputation() {
  const playerValue = (document.getElementById('repPlayer') as HTMLSelectElement)?.value
  const actionValue = (document.getElementById('repAction') as HTMLSelectElement)?.value
  const pointsValue = (document.getElementById('repPoints') as HTMLInputElement)?.value

  if (!playerValue || playerValue === "") {
    showNotification('Please select an player!', 'error')
    return
  }

  if (!actionValue || actionValue === "") {
    showNotification('Please select an action!', 'error')
    return
  }

  if (!pointsValue || pointsValue === "") {
    showNotification('Please enter points!', 'error')
    return
  }

  const points = parseInt(pointsValue)

  if (isNaN(points)) {
    showNotification('Invalid points value!', 'error')
    return
  }

  const data = {
    citizenid: playerValue,
    action: actionValue,
    points: points
  } satisfies UpdateReputationObject

  triggerNuiCallback('updateReputation', data)
}

function submitFinance() {
  const financePlayer = (document.getElementById('financePlayer') as HTMLSelectElement)?.value
  const financeType = (document.getElementById('financeType') as HTMLSelectElement)?.value
  const financeAmount = (document.getElementById('financeAmount') as HTMLInputElement)?.value

  if (!financePlayer || !financeType || !financeAmount) {
    showNotification('Please fill in all fields!', 'error')
    return
  }

  const data = {
    citizenid: financePlayer,
    type: financeType,
    amount: parseInt(financeAmount)
  } satisfies TransferFundsObject

  triggerNuiCallback('transferFunds', data)
}

function submitFunds() {
  const fundsAction = (document.getElementById('fundsAction') as HTMLSelectElement)?.value
  const fundsAmount = (document.getElementById('fundsAmount') as HTMLInputElement)?.value
  const fundsDescription = (document.getElementById('fundsDescription') as HTMLInputElement)?.value

  if (!fundsAction || !fundsAmount || !fundsDescription) {
    showNotification('Please fill in all fields!', 'error')
    return
  }

  const data = {
    action: fundsAction,
    amount: parseInt(fundsAmount),
    reason: fundsDescription
  } satisfies ManageFundsObject

  triggerNuiCallback('manageFunds', data)
}

function openStash () { triggerNuiCallback('openStash') }

function populateRanks(ranks: ServerRanks[]) {
  const rankSelect = document.getElementById('hireRank')

  if (!rankSelect) {
    console.error('Element with ID "hireRank" not found')
    return
  }
  
  if (!Array.isArray(ranks) || ranks.length === 0) {
    rankSelect.innerHTML = '<option value="">No ranks available</option>'
    return
  }

  rankSelect.innerHTML = '<option value="">Select Rank</option>' +
    ranks.map(rank => {
      const grade = rank && rank.grade ? rank.grade : ''
      const name = rank && rank.name ? rank.name : 'Unknown'
      return `<option value="${grade}">${name}</option>`
    }).join('')
}

function updateStats() {
  document.getElementById('totalPlayers')!.textContent = departmentData.totalPlayers.toString()
  document.getElementById('activePlayers')!.textContent = departmentData.activePlayers.toString()
  document.getElementById('departmentBudget')!.textContent = `$${departmentData.budget?.toLocaleString()}`
}

function renderPlayers() {
  const container = document.getElementById('playersList')
  if (!container) return

  const activePlayers = players.filter(o => o.status === true)

  if (activePlayers.length === 0) {
    container.innerHTML = '<div style="text-align: center color: #94a3b8 padding: 20px">No players currently online</div>'
    return
  }

  container.innerHTML = activePlayers.map(player => `
      <div class="player-item">
          <div class="player-avatar">${player.name.split(' ').map(n => n[0]).join('')}</div>
          <div class="player-info">
              <div class="player-name">${player.name}</div>
              <div class="player-details">
                  <span><span class="status-dot"></span>#${player.callsign}</span>
                  <span>${player.rank}</span>
              </div>
          </div>
      </div>
  `).join('')
}

function populateSelects() {
  const selects = ['firePlayer', 'repPlayer', 'financePlayer']
  selects.forEach(id => {
    const select = document.getElementById(id)
    if (!select) return

    if (!players || players.length === 0) {
      select.innerHTML = '<option value="">No players available</option>'
      console.log('No players data available')
      return
    }

    select.innerHTML = '<option value="">Select Employee</option>' +
      players.map(player => {
        const citizenId = player.citizenid

        if (!citizenId) {
          console.warn('No valid citizenId found for player:', player)
          return ''
        }

        return `<option value="${citizenId}">${player.name} (#${player.callsign})</option>`
      }).filter(option => option !== '').join('')
  })
}

const hideDashboard = () => {
  document.body.style.display = 'none'
}

export const updateData = (data: { 
  players: Awaited<UpdateDataCB["players"]>, 
  stats: { [K in keyof UpdateDataCB["stats"]]: Awaited<UpdateDataCB["stats"][K]> }, 
  ranks: UpdateDataCB["ranks"] 
}) => {
  if (data.players) players = data.players
  if (data.stats) departmentData = data.stats
  if (data.ranks) populateRanks(data.ranks)

  updateStats()
  renderPlayers()
  populateSelects()
}

export const showNotification = (message: string, type: unknown) => {
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i><span>${message}</span>`

  document.body.appendChild(notification)
  setTimeout(() => notification.classList.add('show'), 100)
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => notification.remove(), 200)
  }, 3000)
}

export function exitDesk () { 
  nuiFocus(false, false)
  hideDashboard()
}