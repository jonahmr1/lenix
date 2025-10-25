let currentConfig = null;
let currentJobs = null;
let selectedJob = null;

// Function to initialize the UI with config data
function initializeUI(config, jobs) {
  currentConfig = config;
  currentJobs = jobs;

  // Update UI elements from config
  if (config.UI) {
    const titleElement = document.getElementById('ui-title');
    const subtitleElement = document.getElementById('ui-subtitle');

    if (titleElement && config.UI.title) {
      titleElement.textContent = config.UI.title;
    }
    if (subtitleElement && config.UI.subtitle) {
      subtitleElement.textContent = config.UI.subtitle;
    }

    if (config.UI.maxWidth) {
      const container = document.querySelector('.job-center-container');
      if (container) {
        container.style.maxWidth = config.UI.maxWidth;
      }
    }
    if (config.UI.maxHeight) {
      const container = document.querySelector('.job-center-container');
      if (container) {
        container.style.height = config.UI.maxHeight;
      }
    }
  }

  // Apply theme colors if configured
  if (config.Theme) {
    applyTheme(config.Theme);
  }

  // Generate job list from config
  generateJobList(jobs);
}

// Function to apply theme colors
function applyTheme(theme) {
  const root = document.documentElement;

  if (theme.primary) {
    root.style.setProperty('--primary-color', theme.primary);
  }
  if (theme.secondary) {
    root.style.setProperty('--secondary-color', theme.secondary);
  }
  if (theme.background) {
    root.style.setProperty('--background-color', theme.background);
    const container = document.querySelector('.job-center-container');
    if (container) {
      container.style.background = `rgba(${theme.background})`;
    }
  }
  if (theme.gradient) {
    root.style.setProperty('--gradient', theme.gradient);
  }
  if (theme.sidebar) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.background = theme.sidebar;
    }
  }
  if (theme.stats) {
    root.style.setProperty('--job-stats', theme.stats);
  }

  // Apply theme text and UI elements
  if (theme.ui_title && theme.ui_subtitle) {
    const titleElement = document.getElementById('ui-title');
    const subtitleElement = document.getElementById('ui-subtitle');

    if (titleElement) {
      titleElement.innerHTML = theme.ui_title;
    }
    if (subtitleElement) {
      subtitleElement.innerHTML = theme.ui_subtitle;
    }
  }

  if (theme.placeholder_h3 && theme.placeholder_p) {
    const placeholderH3 = document.getElementById('placeholder_h3');
    const placeholderP = document.getElementById('placeholder_p');

    if (placeholderH3) {
      placeholderH3.innerHTML = theme.placeholder_h3;
    }
    if (placeholderP) {
      placeholderP.innerHTML = theme.placeholder_p;
    }
  }

  if (theme.text) {
    document.body.style.color = theme.text;
    root.style.setProperty('--text-color', theme.text);
  }
}

// Function to generate job list from config
function generateJobList(jobs) {
  const jobListContainer = document.getElementById('job-list');
  if (!jobListContainer) return;

  jobListContainer.innerHTML = '';

  let firstEnabledJob = null;

  for (const [jobId, jobData] of Object.entries(jobs)) {
    if (!firstEnabledJob && jobData.enabled) {
      firstEnabledJob = jobId;
    }

    const jobItem = document.createElement('div');
    jobItem.className = `job-item ${!jobData.enabled ? 'disabled' : ''}`;
    jobItem.dataset.job = jobId;

    jobItem.innerHTML = `
      <div class="job-icon">
        <i class="${jobData.icon || 'fa-solid fa-briefcase'}"></i>
      </div>
      <div class="job-info">
        <h3>${jobData.name}</h3>
        <p>${jobData.category}</p>
      </div>
    `;

    if (jobData.enabled) {
      jobItem.addEventListener('click', () => selectJob(jobId));
    }

    jobListContainer.appendChild(jobItem);
  }

  // Select first enabled job by default
  if (firstEnabledJob && jobs[firstEnabledJob].enabled) {
    selectJob(firstEnabledJob);
  }
}

// Function to select and display a job
function selectJob(jobId) {
  if (!currentJobs || !currentJobs[jobId] || !currentJobs[jobId].enabled) {
    return;
  }

  selectedJob = jobId;
  const jobData = currentJobs[jobId];

  // Update active state in sidebar
  document.querySelectorAll('.job-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.job === jobId) {
      item.classList.add('active');
    }
  });

  // Generate job content
  generateJobContent(jobId, jobData);
}

// Function to generate job content dynamically
function generateJobContent(jobId, jobData) {
  const contentContainer = document.getElementById('job-content');
  if (!contentContainer) return;

  // Calculate progress percentage
  const progressPercentage = jobData.progress ?
    Math.min((jobData.progress.currentXP / jobData.progress.maxXP) * 100, 100) : 0;

  // Check requirements
  const requirementsMet = checkRequirements(jobData.requirements);

  contentContainer.innerHTML = `
    <div class="job-content" id="${jobId}-content">
      <div class="job-image">
        ${generateJobImage(jobData.image)}
      </div>
      
      <div class="job-details">
        <h2>${jobData.position || jobData.name}</h2>
        <p class="job-description">
          ${jobData.description}
        </p>
        
        ${generateRequirements(jobData.requirements)}
        
        <div class="job-stats">
          <div class="stat">
            <span class="stat-value">${jobData.progress?.level || 1}</span>
            <span class="stat-label">Current Level</span>
          </div>
          <div class="stat">
            <span class="stat-value">${jobData.stats.payment || '$0'}</span>
            <span class="stat-label">${jobData.stats.paymentLabel || 'Payment'}</span>
          </div>
          <div class="stat">
            <span class="stat-value">${jobData.stats.availability || 'N/A'}</span>
            <span class="stat-label">${jobData.stats.availabilityLabel || 'Availability'}</span>
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="level-info">
            <span>Level ${jobData.progress?.level || 1}</span>
            <span>${jobData.progress?.currentXP || 0} / ${jobData.progress?.maxXP || 100} XP</span>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="takeJob('${jobId}', '${jobData.name}')" ${!requirementsMet ? 'disabled' : ''}>
          Take Job
        </button>
        <button class="btn btn-secondary" onclick="markLocation('${jobId}')" ${!jobData.location ? 'disabled' : ''}>
          Mark Location
        </button>
      </div>
    </div>
  `;
}

// Function to generate job image
function generateJobImage(imageData) {
  if (!imageData) {
    return `
      <div class="no-image-placeholder">
        <i class="fa-solid fa-image"></i>
        <span>No Image</span>
      </div>
    `;
  }

  // Handle string URLs directly
  if (typeof imageData === 'string') {
    return `<img src="${imageData}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`;
  }

  // Handle Discord URLs or external URLs
  if (imageData.type && imageData.type.startsWith('http')) {
    return `<img src="${imageData.type}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`;
  }

  // Handle SVG content from config
  if (imageData.type === 'svg' && imageData.content) {
    if (imageData.content.startsWith('data:image/svg+xml')) {
      return `<img src="${imageData.content}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`;
    } else {
      // Handle raw SVG content from config
      return `<div class="svg-container">${imageData.content}</div>`;
    }
  }
  // Handle regular URL images
  else if (imageData.type === 'url' && imageData.content) {
    return `<img src="${imageData.content}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`;
  }

  return generateNoImagePlaceholder();
}

// Helper function to generate no image placeholder
function generateNoImagePlaceholder() {
  return `
    <div class="no-image-placeholder">
      <i class="fa-solid fa-image"></i>
      <span>Image not available</span>
    </div>
  `;
}

// Function to generate requirements section
function generateRequirements(requirements) {
  if (!requirements || Object.keys(requirements).length === 0) {
    return '';
  }

  let requirementsHTML = '<div class="requirements"><h4>Requirements</h4>';

  if (requirements.license !== undefined) {
    const met = checkLicenseRequirement(requirements.license);
    const licenseText = requirements.license ? 'Valid driving license required' : 'No license required';
    requirementsHTML += `
      <div class="requirement-item ${met ? 'requirement-met' : 'requirement-not-met'}">
        <span class="requirement-icon">${met ? '✓' : '✗'}</span>
        <span>${licenseText}</span>
      </div>
    `;
  }

  requirementsHTML += '</div>';
  return requirementsHTML;
}

// Function to check if requirements are met
function checkRequirements(requirements) {
  if (!requirements) return true;

  if (requirements.license !== undefined && !checkLicenseRequirement(requirements.license)) {
    return false;
  }

  return true;
}

// Placeholder functions for requirement checking (implement based on your framework)
function checkLevelRequirement(requiredLevel) {
  // TODO: Implement actual level checking with your player data system
  // For now, return true as placeholder
  return true;
}

function checkLicenseRequirement(requiresLicense) {
  // TODO: Implement actual license checking with your license system
  // For now, return true as placeholder
  return true;
}

// Function to handle taking a job
function takeJob(jobName, jobLabel) {
  if (!jobName || !currentJobs[jobName]) {
    console.error('Invalid job name:', jobName);
    return;
  }

  // Post to Lua callback
  fetch(`https://${GetParentResourceName()}/takeJob`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job: jobName,
      label: jobLabel
    })
  }).catch(error => {
    console.error('Error taking job:', error);
  });
}

// Function to mark location on map
function markLocation(jobName) {
  if (!jobName || !currentJobs[jobName]) {
    console.error('Invalid job name:', jobName);
    return;
  }

  // Post to Lua callback
  fetch(`https://${GetParentResourceName()}/markLocation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job: jobName
    })
  }).catch(error => {
    console.error('Error marking location:', error);
  });
}

// Function to close UI
function closeUI() {
  document.body.classList.remove('show');
  
  // Post to Lua callback
  fetch(`https://${GetParentResourceName()}/closeUI`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  }).catch(error => {
    console.error('Error closing UI:', error);
  });
}

// Function to show UI
function showUI() {
  document.body.classList.add('show');
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize close button
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeUI);
  }

  // Initialize with default state
  document.body.classList.remove('show');
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Cairo', sans-serif;
      background: var(--gradient);
      color: #ffffff;
      overflow: hidden;
      user-select: none;
      height: 100vh;
      display: none;
      align-items: center;
      justify-content: center;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    button {
      font-family: 'Cairo';
    }

    body.show {
      display: flex;
      font-weight: bolder;
    }

    .job-center-container {
      width: 90vw;
      max-width: 1200px;
      height: 80vh;
      border-radius: 0.3rem;
      display: flex;
      overflow: hidden;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
    }

    body.show .job-center-container {
      opacity: 1;
      transform: scale(1);
    }

    .sidebar {
      width: 350px;
      padding: 30px 0;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: scroll;
    }

    .header {
      padding: 0 30px 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 5px;
      background: linear-gradient(135deg, rgb(var(--primary-color)), rgba(var(--secondary-color)));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header p {
      color: #888;
      font-size: 14px;
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 25px;
      background: none;
      border: none;
      color: #fff;
      font-size: 15px;
      cursor: pointer;
      transition: color 0.3s ease;
      z-index: 10;
      border-radius: 4px;
      background-color: #ffffff14;
      padding: 0 6px;
    }

    .close-btn:hover {
      background-color: #ffffff21;
    }

    .job-list {
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      gap: 5px;
    }

    .job-item {
      padding: 15px 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      display: flex;
      align-items: center;
      gap: 15px;
      background-color: rgb(223 223 223 / 5%);
    }

    .job-item:hover {
      background: rgba(var(--primary-color), 0.1);
      border-left-color: rgb(var(--primary-color));
    }

    .job-item.active {
      background: rgba(var(--primary-color), 0.15);
      border-left-color: rgb(var(--primary-color));
    }

    .job-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .job-item.disabled:hover {
      background: transparent;
      border-left-color: transparent;
    }

    .job-icon {
      width: 40px;
      height: 40px;
      background: rgba(var(--primary-color), 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: rgb(var(--primary-color));
    }

    .job-info h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .active > .job-info h3 {
      text-shadow: 0rem 0rem 0.3rem #fff;
    }

    .job-info p {
      font-size: 12px;
      color: #888;
    }

    .main-content {
      flex: 1;
      padding: 50px 20px;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
      overflow-y: scroll;
    }

    .job-image {
      width: 100%;
      height: 350px;
      background: #1a1a1a;
      border-radius: 15px;
      margin-bottom: 30px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
    }

    .job-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .job-image svg {
      width: 100%;
      height: 100%;
    }

    .job-image::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    }

    .job-details {
      flex: 1;
    }

    .job-details h2 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
    }

    .job-description {
      font-size: 14px;
      line-height: 1.6;
      color: #ccc;
      margin-bottom: 25px;
    }

    .job-stats {
      display: var(--job-stats);
      gap: 30px;
      margin-bottom: 30px;
      background-color: rgba(255, 255, 255, 0.05);
      padding: 10px;
      border-radius: 4px;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: rgb(var(--primary-color));
      display: block;
    }

    .stat-label {
      font-size: 12px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .requirements {
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      border-left: 3px solid rgb(var(--primary-color));
    }

    .requirements h4 {
      font-size: 14px;
      color: rgb(var(--primary-color));
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .requirement-item {
      font-size: 12px;
      color: #ccc;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .requirement-met {
      color: #4ade80;
    }

    .requirement-not-met {
      color: #ef4444;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      margin-top: 1rem;
    }

    .btn {
      padding: 6px 54px;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: rgb(var(--primary-color));
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(var(--primary-color), 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 20px;
    }

    .progress-fill {
      height: 100%;
      background-color: rgb(var(--primary-color));
      border-radius: 3px;
      transition: width 0.3s ease;
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
      border-radius: 3px;
      box-shadow: 0 8px 25px rgba(var(--primary-color), 0.9);
    }

    .level-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      font-size: 12px;
      color: white;
    }

    .hidden {
      display: none;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(50px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .main-content {
      animation: slideIn 0.5s ease-out;
    }

    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: #666;
    }

    .placeholder-icon {
      font-size: 60px;
      margin-bottom: 20px;
      color: #333;
    }
  `
});

// Listen for messages from Lua script
window.addEventListener('message', (event) => {
  const data = event.data;

  switch (data.action) {
    case 'openJobCenter':
      if (data.jobs && data.config) {
        initializeUI(data.config, data.jobs);
      }
      showUI();
      break;

    case 'closeJobCenter':
      document.body.classList.remove('show');
      break;

    default:
      console.warn('Unknown action received:', data.action);
      break;
  }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeUI();
  }
});

// Prevent context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Global error handler
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
});

window.generateNoImagePlaceholder = generateNoImagePlaceholder;
window.takeJob = takeJob;
window.markLocation = markLocation;