import 'server-only'

import { youtube } from '@googleapis/youtube'
import { GaxiosError } from 'gaxios'
import { setTimeout as delay } from 'node:timers/promises'

interface YouTubeFailure {
  error?: {
    errors?: { reason?: string }[]
    details?: { metadata?: { quota_unit?: string; quota_limit?: string } }[]
  }
}

export function youtubeFailure(error: unknown) {
  if (!(error instanceof GaxiosError)) return 'other'
  const failure = error.response?.data as YouTubeFailure | undefined
  const reasons = failure?.error?.errors?.map(item => item.reason) ?? []
  if (
    reasons.includes('quotaExceeded') ||
    reasons.includes('dailyLimitExceeded') ||
    failure?.error?.details?.some(
      ({ metadata }) =>
        metadata?.quota_unit?.split('/').includes('d') ||
        metadata?.quota_limit?.toLowerCase().includes('perday')
    )
  )
    return 'quota'
  return error.response?.status === 429 ||
    reasons.includes('rateLimitExceeded') ||
    reasons.includes('userRateLimitExceeded')
    ? 'rate'
    : 'other'
}

export const youtubeClient = youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  timeout: 10000,
  fetchImplementation: (url, options) =>
    fetch(url, { ...options, next: { revalidate: 300 } }),
  retryConfig: {
    retry: 3,
    shouldRetry: error =>
      youtubeFailure(error) === 'rate' &&
      (error.config.retryConfig?.currentRetryAttempt ?? 0) < 3,
    retryBackoff: async error => {
      const attempt = error.config.retryConfig?.currentRetryAttempt ?? 1
      const header = error.response?.headers.get('retry-after')
      const wait = header
        ? Number.isFinite(Number(header))
          ? Number(header) * 1000
          : Date.parse(header) - Date.now()
        : 1000 * 2 ** (attempt - 1)
      if (!Number.isFinite(wait) || wait > 10000) throw error
      await delay(Math.max(1000 * 2 ** (attempt - 1), wait))
    },
  },
})
