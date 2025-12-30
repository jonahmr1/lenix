import './api'
import { createDatabaseTable } from './database/schema'
import { fatal } from '@trippler/tr_lib/shared'

setImmediate(async () => {
  const success = await createDatabaseTable()
  if (!success) fatal('Failed to create database table')
})