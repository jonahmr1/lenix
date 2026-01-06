import { jobsConfig } from "../constants";

export type JobName = keyof typeof jobsConfig;

export interface JobProgress {
  level: number
  currentXP: number
  maxXP: number
  totalRep: number | null
}

export type JobConfig = typeof jobsConfig[JobName] & {
  progress?: JobProgress
}