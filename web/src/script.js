let players = [];
let departmentData = { budget: 0, totalPlayers: 0, activePlayers: 0 };

function showForm(formName) {
  document.querySelectorAll('.form-section').forEach(f => f.classList.remove('active'));
  document.getElementById(formName + 'Form').classList.add('active');
}

function exitDesk() {
  fetch(`https://${GetParentResourceName()}/closeUI`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
}

function updateData(data) {
  // Fix: Server sends 'players', but we use 'players' in JS
  if (data.players) players = data.players;
  if (data.players) players = data.players; // Backup in case server changes
  if (data.stats) departmentData = data.stats;
  if (data.ranks) populateRanks(data.ranks); // Populate rank dropdown

  updateStats();
  renderPlayers();
  populateSelects();
}

function populateRanks(ranks) {
  const rankSelect = document.getElementById('hireRank');

  // Check if rankSelect exists
  if (!rankSelect) {
    console.error('Element with ID "hireRank" not found');
    return;
  }
  
  // Check if ranks is an array and has content
  if (!Array.isArray(ranks) || ranks.length === 0) {
    rankSelect.innerHTML = '<option value="">No ranks available</option>';
    return;
  }

  // Populate the select with ranks
  rankSelect.innerHTML = '<option value="">Select Rank</option>' +
    ranks.map(rank => {
      // Ensure rank object has the required properties
      const grade = rank && rank.grade ? rank.grade : '';
      const name = rank && rank.name ? rank.name : 'Unknown';
      return `<option value="${grade}">${name}</option>`;
    }).join('');
}

function updateStats() {
  document.getElementById('totalPlayers').textContent = departmentData.totalPlayers;
  document.getElementById('activePlayers').textContent = departmentData.activePlayers;
  document.getElementById('departmentBudget').textContent = `$${departmentData.budget?.toLocaleString()}`;
}

function renderPlayers() {
  const container = document.getElementById('playersList');

  // Filter online players (status: true means online)
  const activePlayers = players.filter(o => o.status === true);

  if (activePlayers.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 20px;">No players currently online</div>';
    return;
  }

  container.innerHTML = activePlayers.map(player => `
      <div class="player-item">
          <div class="player-avatar">${player.name.split(' ').map(n => n[0]).join('')}</div>
          <div class="player-info">
              <div class="player-name">${player.name}</div>
              <div class="player-details">
                  <span><span class="status-dot"></span>#${player.badge}</span>
                  <span>${player.rank}</span>
              </div>
          </div>
      </div>
  `).join('');
}

function populateSelects() {
  const selects = ['firePlayer', 'repPlayer', 'financePlayer'];
  selects.forEach(id => {
    const select = document.getElementById(id);

    if (!players || players.length === 0) {
      select.innerHTML = '<option value="">No players available</option>';
      console.log('No players data available');
      return;
    }

    select.innerHTML = '<option value="">Select Employee</option>' +
      players.map(o => {
        // Based on your JSON, the citizenId is in 'id' field
        const citizenId = o.id || o.citizenid || o.citizen_id || o.cid || o.identifier;

        if (!citizenId) {
          console.warn('No valid citizenId found for player:', o);
          return '';
        }

        return `<option value="${citizenId}">${o.name} (#${o.badge})</option>`;
      }).filter(option => option !== '').join('');
  });
}

function submitHire() {
  const hireName = document.getElementById('hireName').value;
  const hireRank = document.getElementById('hireRank').value;
  const hireBadge = document.getElementById('hireBadge').value;

  if (!hireName || !hireRank || !hireBadge) {
    showNotification('Please fill in all fields!', 'error');
    return;
  }

  const data = {
    citizenid: hireName,
    rank: hireRank,
    badge: parseInt(hireBadge)
  };

  fetch(`https://${GetParentResourceName()}/hirePlayer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function submitFire() {
  const firePlayer = document.getElementById('firePlayer').value;
  const fireReason = document.getElementById('fireReason').value;

  if (!firePlayer || firePlayer === "") {
    showNotification('Please select an player!', 'error');
    return;
  }

  if (!fireReason || fireReason === "") {
    showNotification('Please select a reason!', 'error');
    return;
  }

  const data = {
    citizenid: firePlayer,  // Send citizen ID instead of player ID
    reason: fireReason
  };

  fetch(`https://${GetParentResourceName()}/firePlayer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function submitReputation() {
  const playerValue = document.getElementById('repPlayer').value;
  const actionValue = document.getElementById('repAction').value;
  const pointsValue = document.getElementById('repPoints').value;

  // Validation checks
  if (!playerValue || playerValue === "") {
    showNotification('Please select an player!', 'error');
    return;
  }

  if (!actionValue || actionValue === "") {
    showNotification('Please select an action!', 'error');
    return;
  }

  if (!pointsValue || pointsValue === "") {
    showNotification('Please enter points!', 'error');
    return;
  }

  // Convert points to number and check if valid
  const points = parseInt(pointsValue);

  if (isNaN(points)) {
    showNotification('Invalid points value!', 'error');
    return;
  }

  const data = {
    citizenid: playerValue,  // Send citizen ID instead of player ID
    action: actionValue,
    points: points
  };

  fetch(`https://${GetParentResourceName()}/updateReputation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function submitFinance() {
  const financePlayer = document.getElementById('financePlayer').value;
  const financeType = document.getElementById('financeType').value;
  const financeAmount = document.getElementById('financeAmount').value;

  if (!financePlayer || !financeType || !financeAmount) {
    showNotification('Please fill in all fields!', 'error');
    return;
  }

  const data = {
    citizenid: financePlayer,  // Send citizen ID instead of player ID
    type: financeType,
    amount: parseInt(financeAmount)
  };

  fetch(`https://${GetParentResourceName()}/transferFunds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function submitFunds() {
  const fundsAction = document.getElementById('fundsAction').value;
  const fundsAmount = document.getElementById('fundsAmount').value;
  const fundsDescription = document.getElementById('fundsDescription').value;

  if (!fundsAction || !fundsAmount || !fundsDescription) {
    showNotification('Please fill in all fields!', 'error');
    return;
  }

  const data = {
    action: fundsAction,
    amount: parseInt(fundsAmount),
    description: fundsDescription
  };

  fetch(`https://${GetParentResourceName()}/manageFunds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function openStash() {
  fetch(`https://${GetParentResourceName()}/openStash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i><span>${message}</span>`;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 200);
  }, 3000);
}

window.addEventListener('message', function (event) {
  const data = event.data;

  switch (data.action) {
    case 'updateData':
      updateData(data);
      break;
    case 'showNotification':
      showNotification(data.message, data.type);
      break;
    case 'closeUI':
      document.body.style.display = 'none';
      break;
    case 'openUI':
      document.body.style.display = 'block';
      break;
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    exitDesk();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('root').innerHTML = `
    <div class="header">
        <h1><i class="fas fa-shield-alt"></i> Police Administration</h1>
        <p>Department Management System</p>
    </div>

    <div class="main-grid">
        <!-- Management Tools -->
        <div class="section management-section">
            <div>
                <h2 class="section-title">
                    <i class="fas fa-cogs"></i>
                    Management
                </h2>
                
                <button class="btn btn-success" onclick="showForm('hire')">
                    <i class="fas fa-user-plus"></i>
                    Hire Employee
                </button>
                
                <button class="btn btn-danger" onclick="showForm('fire')">
                    <i class="fas fa-user-minus"></i>
                    Fire Employee
                </button>
                
                <button class="btn" onclick="showForm('reputation')">
                    <i class="fas fa-star"></i>
                    Reputation
                </button>
                
                <button class="btn btn-primary" onclick="showForm('finance')">
                    <i class="fas fa-dollar-sign"></i>
                    Transfer Funds
                </button>
                
                <button class="btn" onclick="openStash()">
                    <i class="fas fa-box"></i>
                    Stash Access
                </button>
                
                <button class="btn" onclick="showForm('funds')">
                    <i class="fas fa-university"></i>
                    Budget Control
                </button>
            </div>
            
            <button class="btn btn-exit" onclick="exitDesk()">
                <i class="fas fa-sign-out-alt"></i>
                Exit Desk
            </button>
        </div>

        <!-- Center Content -->
        <div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" id="totalPlayers">0</div>
                    <div class="stat-label">Total Players</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="activePlayers">0</div>
                    <div class="stat-label">On Duty</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="departmentBudget">$0</div>
                    <div class="stat-label">Budget</div>
                </div>
            </div>

            <!-- Forms -->
            <div class="form-section" id="hireForm">
                <h3>Hire New Employee</h3>
                <div class="form-group">
                    <label class="form-label">Employee CID</label>
                    <input type="text" class="form-input" id="hireName" placeholder="Enter player's citizen Identity">
                </div>
                <div class="form-group">
                    <label class="form-label">Starting Rank</label>
                    <select class="form-select" id="hireRank">
                        <option value="">Select Rank</option>
                        <!-- Ranks will be populated from client data -->
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Badge Number</label>
                    <input type="number" class="form-input" id="hireBadge" placeholder="Enter badge number">
                </div>
                <button class="btn btn-success" onclick="submitHire()">
                    <i class="fas fa-user-plus"></i>
                    Hire Employee
                </button>
            </div>

            <div class="form-section" id="fireForm">
                <h3>Fire Employee</h3>
                <div class="form-group">
                    <label class="form-label">Select Employee</label>
                    <select class="form-select" id="firePlayer">
                        <option value="">Select Employee</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Reason</label>
                    <select class="form-select" id="fireReason">
                        <option value="">Select Reason</option>
                        <option value="Performance">Performance Issues</option>
                        <option value="Misconduct">Misconduct</option>
                        <option value="Budget">Budget Cuts</option>
                    </select>
                </div>
                <button class="btn btn-danger" onclick="submitFire()">
                    <i class="fas fa-user-minus"></i>
                    Fire Employee
                </button>
            </div>

            <div class="form-section" id="reputationForm">
                <h3>Manage Reputation</h3>
                <div class="form-group">
                    <label class="form-label">Select Employee</label>
                    <select class="form-select" id="repPlayer">
                        <option value="">Select Employee</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Action</label>
                    <select class="form-select" id="repAction">
                        <option value="">Select Action</option>
                        <option value="commendation">Commendation (+)</option>
                        <option value="warning">Warning (-)</option>
                        <option value="suspension">Suspension (0)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Points</label>
                    <input type="number" class="form-input" id="repPoints" placeholder="Enter points">
                </div>
                <button class="btn" onclick="submitReputation()">
                    <i class="fas fa-star"></i>
                    Update Reputation
                </button>
            </div>

            <div class="form-section" id="financeForm">
                <h3>Transfer Funds</h3>
                <div class="form-group">
                    <label class="form-label">Select Employee</label>
                    <select class="form-select" id="financePlayer">
                        <option value="">Select Employee</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Transfer Type</label>
                    <select class="form-select" id="financeType">
                        <option value="">Select Type</option>
                        <option value="salary">Salary Payment</option>
                        <option value="bonus">Performance Bonus</option>
                        <option value="overtime">Overtime Payment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount ($)</label>
                    <input type="number" class="form-input" id="financeAmount" placeholder="Enter amount">
                </div>
                <button class="btn btn-primary" onclick="submitFinance()">
                    <i class="fas fa-dollar-sign"></i>
                    Transfer Funds
                </button>
            </div>

            <div class="form-section" id="fundsForm">
                <h3>Budget Control</h3>
                <div class="form-group">
                    <label class="form-label">Action</label>
                    <select class="form-select" id="fundsAction">
                        <option value="">Select Action</option>
                        <option value="deposit">Deposit Funds</option>
                        <option value="withdraw">Withdraw Funds</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount ($)</label>
                    <input type="number" class="form-input" id="fundsAmount" placeholder="Enter amount">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-input" id="fundsDescription" placeholder="Enter description">
                </div>
                <button class="btn" onclick="submitFunds()">
                    <i class="fas fa-university"></i>
                    Process Transaction
                </button>
            </div>
        </div>

        <!-- Active Players -->
        <div class="section">
            <h2 class="section-title">
                <i class="fas fa-users"></i>
                Active Players
            </h2>
            <div id="playersList" style="max-height: 500px; overflow-y: auto;">
                <!-- Players populated here -->
            </div>
        </div>
    </div>
  `
})