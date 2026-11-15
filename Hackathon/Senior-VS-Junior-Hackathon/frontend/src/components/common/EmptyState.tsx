import type * as React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon = <Inbox className="w-10 h-10 text-zinc-400" />,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50',
        className
      )}
    >
      <div className="mb-3 p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h4>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="default" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

