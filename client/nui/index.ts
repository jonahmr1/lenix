import { onNuiCallback } from "@trippler/tr_lib/client"
import { closeJobCenter, showNotification } from "../modules"
import { jobsConfig } from "../../shared/constants"
import { JobName, JobConfig } from "../../shared/types"

onNuiCallback('closeUI', (_data, cb) => {
  closeJobCenter()
  cb(true) 
})

onNuiCallback<{ jobName: JobName, jobLabel: JobConfig["name"] }>('takeJob', (data, cb) => {
  if (!jobsConfig[data.jobName]) {
    cb(false)
    return
  } 

  emitNet('lenix_jobcenter:takeJob', data.jobName, data.jobLabel)
  closeJobCenter()
  cb(true)
})

onNuiCallback<{ jobName: JobName }>('markLocation', (data, cb) => {
  const job = jobsConfig[data.jobName]
  if (job && job.location) {
    SetNewWaypoint(job.location.x, job.location.y)
    showNotification(`Location marked for ${job.name}`)
    cb(true)
  } else cb(false)
})
