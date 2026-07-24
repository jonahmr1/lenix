import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { jobsConfig, styleConfig } from "../../../shared/constants"
import { JobConfig, JobName } from "../../../shared/types"

let jobsProgress: JobConfig["progress"]

const applyTheme = () => {
  const root = document.documentElement

  if (styleConfig.theme.primary) {
    root.style.setProperty('--primary-color', styleConfig.theme.primary)
  }
  if (styleConfig.theme.secondary) {
    root.style.setProperty('--secondary-color', styleConfig.theme.secondary)
  }
  if (styleConfig.theme.background) {
    root.style.setProperty('--background-color', styleConfig.theme.background)
    const container = document.querySelector('.job-center-container') as HTMLDivElement
    if (container) {
      container.style.background = `rgba(${styleConfig.theme.background})`/* broken */
    }
  }
  if (styleConfig.theme.gradient) {
    root.style.setProperty('--gradient', styleConfig.theme.gradient)
  }
  if (styleConfig.theme.sidebar) {
    const sidebar = document.querySelector('.sidebar') as HTMLDivElement
    if (sidebar) {
      sidebar.style.background = styleConfig.theme.sidebar
    }
  }
  if (styleConfig.theme.stats) {
    root.style.setProperty('--job-stats', styleConfig.theme.stats)
  }

  if (styleConfig.theme.ui_title && styleConfig.theme.ui_subtitle) {
    const titleElement = document.getElementById('ui-title')
    const subtitleElement = document.getElementById('ui-subtitle')

    if (titleElement) {
      titleElement.innerHTML = styleConfig.theme.ui_title
    }
    if (subtitleElement) {
      subtitleElement.innerHTML = styleConfig.theme.ui_subtitle
    }
  }

  if (styleConfig.theme.placeholder_h3 && styleConfig.theme.placeholder_p) {
    const placeholderH3 = document.getElementById('placeholder_h3')
    const placeholderP = document.getElementById('placeholder_p')

    if (placeholderH3) {
      placeholderH3.innerHTML = styleConfig.theme.placeholder_h3
    }
    if (placeholderP) {
      placeholderP.innerHTML = styleConfig.theme.placeholder_p
    }
  }

  if (styleConfig.theme.text) {
    document.getElementById('root')!.style.color = styleConfig.theme.text
    root.style.setProperty('--text-color', styleConfig.theme.text)
  }
}

const generateJobList = () => {
  const jobListContainer = document.getElementById('job-list')
  if (!jobListContainer) return

  jobListContainer.innerHTML = ''

  for (const [jobId, jobData] of Object.entries(jobsConfig)) {
    if (jobData.enabled) {

      const jobItem = document.createElement('div')
      jobItem.className = `job-item ${!jobData.enabled ? 'disabled' : ''}`
      jobItem.dataset.job = jobId

      jobItem.innerHTML = `
        <div class="job-icon">
          <i class="${jobData.icon || 'fa-solid fa-briefcase'}"></i>
        </div>
        <div class="job-info">
          <h3>${jobData.name}</h3>
          <p>${jobData.category}</p>
        </div>
      `

      if (jobData.enabled) {
        jobItem.addEventListener('click', () => selectJob(jobId as JobName))
      }

      jobListContainer.appendChild(jobItem)
      selectJob(jobId as JobName)
      break
    }
  }
}

const selectJob = (jobName: JobName) => {
  if (!jobsConfig || !jobsConfig[jobName] || !jobsConfig[jobName].enabled) {
    return
  }

  const jobData = jobsConfig[jobName]

  document.querySelectorAll<HTMLDivElement>('.job-item').forEach(item => {
    item.classList.remove('active')
    if (item.dataset.job === jobName) {
      item.classList.add('active')
    }
  })

  generateJobContent(jobName, jobData)
}

const generateJobContent = (jobName: JobName, jobData: JobConfig) => {
  const contentContainer = document.getElementById('job-content')
  if (!contentContainer) return

  const progressPercentage = jobData.progress ?
    Math.min((jobData.progress.currentXP / jobData.progress.maxXP) * 100, 100) : 0

  const requirementsMet = checkRequirements(jobData.requirements)

  contentContainer.innerHTML = `
    <div class="job-content" id="${jobName}-content">
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
        <button class="btn btn-primary" onclick="takeJob('${jobName}', '${jobData.name}')" ${!requirementsMet ? 'disabled' : ''}>
          Take Job
        </button>
        <button class="btn btn-secondary" onclick="markLocation('${jobName}')" ${!jobData.location ? 'disabled' : ''}>
          Mark Location
        </button>
      </div>
    </div>
  `
}

const generateJobImage = (imageData: any) => {
  if (!imageData) {
    return `
      <div class="no-image-placeholder">
        <i class="fa-solid fa-image"></i>
        <span>No Image</span>
      </div>
    `
  }

  if (typeof imageData === 'string') {
    return `<img src="../assets/${imageData}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`
  }

  if (imageData.type && imageData.type.startsWith('http')) {
    return `<img src="${imageData.type}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`
  }

  if (imageData.type === 'img' && imageData.content) {
    return `<img src="../assets/${imageData.content}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`
  }
  else if (imageData.type === 'url' && imageData.content) {
    return `<img src="${imageData.content}" alt="Job Image" onerror="this.parentElement.innerHTML=generateNoImagePlaceholder()">`
  }

  return generateNoImagePlaceholder()
}

const generateRequirements = (requirements: any) => {
  if (!requirements || Object.keys(requirements).length === 0) {
    return ''
  }
  
  let requirementsHTML = '<div class="requirements"><h4>Requirements</h4>'
  
  if (requirements.license !== undefined) {
    const met = checkLicenseRequirement(requirements.license)
    const licenseText = requirements.license ? 'Valid driving license required' : 'No license required'
    requirementsHTML += `
    <div class="requirement-item ${met ? 'requirement-met' : 'requirement-not-met'}">
    <span class="requirement-icon">${met ? '✓' : '✗'}</span>
    <span>${licenseText}</span>
    </div>
    `
  }
  
  requirementsHTML += '</div>'
  return requirementsHTML
}


const checkRequirements = (requirements: any) => {
  if (!requirements) return true
  
  if (requirements.license !== undefined && !checkLicenseRequirement(requirements.license)) {
    return false
  }
  
  return true
}

const checkLicenseRequirement = (license: any) => {
  return true
}

export const generateNoImagePlaceholder = () => {
  return `
    <div class="no-image-placeholder">
      <i class="fa-solid fa-image"></i>
      <span>Image not available</span>
    </div>
  `
}

export const initializeUI = () => {
  if (styleConfig.ui) {
    const titleElement = document.getElementById('ui-title')
    const subtitleElement = document.getElementById('ui-subtitle')

    if (titleElement && styleConfig.ui.title) {
      titleElement.textContent = styleConfig.ui.title
    }
    if (subtitleElement && styleConfig.ui.subtitle) {
      subtitleElement.textContent = styleConfig.ui.subtitle
    }

    if (styleConfig.ui.maxWidth) {
      const container = document.querySelector('.job-center-container') as HTMLDivElement
      if (container) {
        container.style.maxWidth = styleConfig.ui.maxWidth
      }
    }
    if (styleConfig.ui.maxHeight) {
      const container = document.querySelector('.job-center-container') as HTMLDivElement
      if (container) {
        container.style.height = styleConfig.ui.maxHeight
      }
    }
  }

  if (styleConfig.theme) {
    applyTheme()
  }

  generateJobList()
}

export const takeJob = (jobName: JobName, jobLabel: string) => {
  if (!jobName || !jobsConfig[jobName]) {
    console.error('Invalid job name:', jobName)
    return
  }

  triggerNuiCallback('takeJob', { jobName, jobLabel })
}

export const markLocation = (jobName: JobName) => {
  if (!jobName || !jobsConfig[jobName]) {
    console.error('Invalid job name:', jobName)
    return
  }

  triggerNuiCallback('markLocation', { jobName })
}

export const closeUI = () => {
  hideDashboard()
  triggerNuiCallback('closeUI')
}

export const showUI = (this_jobsProgress: JobConfig["progress"]) => {
  document.getElementById('root')?.classList.add('show')
  jobsProgress = this_jobsProgress
}

export const hideDashboard = () => document.getElementById('root')?.classList.remove('show')