import { useDiv } from "@trippler/tr_kit/nui"

document.body.id = `body`
useDiv({
  parent: 'body',
  id: 'root',
  content: `
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
                    <label class="form-label">Callsign Number</label>
                    <input type="number" class="form-input" id="hireCallsign" placeholder="Enter callsign number">
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

const style = document.createElement('style')
style.innerHTML = `
* {
  margin: 0;
  padding: 0;
  cursor: default;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0f0f0fd3;
  color: #e4e4e7;
  overflow-x: hidden;
  min-height: 100vh;
  display: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 32px;
  margin-bottom: 32px;
  border-left: 3px solid #3b82f6;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.header p {
  color: #94a3b8;
  font-size: 14px;
}

.main-grid {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 32px;
}

.section {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 24px;
  min-height: 46vh;
}

.management-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 12px;
}

.btn {
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #374151;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e4e4e7;
  background: #262626;
  margin-bottom: 8px;
  width: 100%;
}

.btn:hover {
  background: #374151;
  border-color: #4b5563;
}

.btn-primary {
  background: #1e40af;
  border-color: #2563eb;
  color: #ffffff;
}

.btn-danger {
  background: #991b1b;
  border-color: #dc2626;
  color: #ffffff;
}

.btn-success {
  background: #166534;
  border-color: #16a34a;
  color: #ffffff;
}

.btn-exit {
  background: #7c2d12;
  border-color: #ea580c;
  color: #ffffff;
  margin-top: 16px;
  margin-bottom: 0;
}

.btn-exit:hover {
  background: #9a3412;
  border-color: #f97316;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #262626;
  border: 1px solid #374151;
  border-radius: 4px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #262626;
  border: 1px solid #374151;
  border-radius: 4px;
  margin-bottom: 8px;
}

.player-avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: 500;
  margin-bottom: 2px;
  font-size: 14px;
}

.player-details {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  gap: 12px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  display: inline-block;
  margin-right: 4px;
}

.form-section {
  display: none;
  background: #262626;
  border: 1px solid #374151;
  border-radius: 6px;
  padding: 24px;
}

.form-section.active {
  display: block;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 20px;
  border-bottom: 1px solid #374151;
  padding-bottom: 12px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #f8fafc;
  font-size: 13px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  background: #1a1a1a;
  border: 1px solid #374151;
  border-radius: 4px;
  color: #e4e4e7;
  font-size: 13px;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input::placeholder {
  color: #6b7280;
}

.notification {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 12px 16px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  font-size: 13px;
  z-index: 10000;
  transform: translateX(400px);
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid;
}

.notification.show {
  transform: translateX(0);
}

.notification.success {
  background: #166534;
  border-color: #16a34a;
}

.notification.error {
  background: #991b1b;
  border-color: #dc2626;
}

.notification.info {
  background: #1e40af;
  border-color: #2563eb;
}

@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 260px 1fr;
  }

  .section:last-child {
    grid-column: span 2;
    margin-top: 16px;
  }
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
`
document.body.appendChild(style)