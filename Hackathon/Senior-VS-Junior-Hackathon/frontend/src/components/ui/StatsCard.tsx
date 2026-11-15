import type * as React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from './Card'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
          {icon && (
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                'inline-flex items-center text-xs font-semibold',
                trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-zinc-500'
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
              {change}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

