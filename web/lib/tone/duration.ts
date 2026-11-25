import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function formatTrackDuration(value: string | null | undefined) {
  if (!value) return '—'
  const parsed = dayjs.duration(value)
  if (!Number.isFinite(parsed.asSeconds()) || parsed.asSeconds() < 0) return '—'
  const hours = Math.floor(parsed.asHours())
  return hours
    ? `${hours}:${parsed.format('mm:ss')}`
    : `${parsed.minutes()}:${parsed.format('ss')}`
}
