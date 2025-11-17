'use client'

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon, ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: LucideIcon
  iconBgClassName?: string
  iconClassName?: string
  className?: string
  valuePrefix?: string
  changePercent?: number
  changeText?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgClassName = 'bg-violet-100',
  iconClassName = 'text-violet-600',
  className,
  valuePrefix,
  changePercent,
  changeText,
}: StatCardProps) {
  const hasChange = typeof changePercent === 'number'
  const isPositive = (changePercent ?? 0) >= 0

  const formattedPercent =
    typeof changePercent === 'number'
      ? `${Math.abs(changePercent).toLocaleString('pt-BR', {
          maximumFractionDigits: 1,
        })}%`
      : null

  return (
    <Card className={cn('flex flex-col gap-2 p-4', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl',
                iconBgClassName,
              )}
            >
              <Icon className={cn('h-4 w-4', iconClassName)} />
            </div>
          )}

          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-0 pt-3 text-left">
        <div className="flex items-baseline gap-1">
          {valuePrefix && (
            <span className="text-sm font-semibold">{valuePrefix}</span>
          )}
          <span className="text-3xl font-semibold leading-none tracking-tight">
            {value}
          </span>
        </div>

        {subtitle && (
          <span className="text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}

        {hasChange && formattedPercent && (
          <div className="flex items-center gap-1 text-xs">
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {formattedPercent}
            </span>
            {changeText && (
              <span className="text-muted-foreground">
                {changeText}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
