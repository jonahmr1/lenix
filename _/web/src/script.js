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
      container.style.background = `rgba(${theme.background})`;/* broken */
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
    document.getElementById('root').style.color = theme.text;
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

  // Handle IMG content from config
  if (imageData.type === 'img' && imageData.content) {
    return `<img src="${imageData.content}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`;
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
  document.getElementById('root').classList.remove('show');
  
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
  document.getElementById('root').classList.add('show');
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('root').innerHTML = `
    <div class="job-center-container">
        <button class="close-btn">
            <i class="fa-solid fa-xmark"></i>
        </button>
        
        <div class="sidebar">
            <div class="header">
                <h1 id="ui-title"></h1>
                <p id="ui-subtitle"></p>
            </div>
            
            <div class="job-list" id="job-list"> <!-- Jobs will be dynamically populated here --> </div>
        </div>

        <div class="main-content">
            <div id="job-content">
                <div class="placeholder-content">
                    <div class="placeholder-icon"></div>
                    <h3 id="placeholder_h3"></h3>
                    <p id="placeholder_p"></p>
                </div>
            </div>
        </div>
    </div>
  `
  // Initialize close button
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeUI);
  }

  // Initialize with default state
  document.getElementById('root').classList.remove('show');
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
      document.getElementById('root').classList.remove('show');
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