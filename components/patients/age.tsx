"use client"

import dayjs from "@/lib/dayjs"

type Props = {
  birthdate?: string | null
  until?: string | null
  compact?: boolean
  prefix?: string
}

function pluralizePt(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`
}


export function PatientAge({ birthdate, until, compact = true, prefix }: Props) {
  if (!birthdate) return null
  const start = dayjs(birthdate)
  const end = until ? dayjs(until) : dayjs()
  if (!start.isValid() || !end.isValid() || end.isBefore(start)) return null

  const years = end.diff(start, 'year')
  const afterYears = start.add(years, 'year')
  const months = end.diff(afterYears, 'month')
  const afterMonths = afterYears.add(months, 'month')
  const days = end.diff(afterMonths, 'day')

  const label = compact
    ? `${years}a ${months}m ${days}d`
    : `${pluralizePt(years, 'ano', 'anos')}, ${pluralizePt(months, 'mês', 'meses')} e ${pluralizePt(days, 'dia', 'dias')}`

  return <span>{prefix ? `${prefix} ` : ''}{label}</span>
}
