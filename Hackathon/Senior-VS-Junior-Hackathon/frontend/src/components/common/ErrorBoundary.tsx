import type * as React from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 m-4 rounded-xl border border-rose-200 bg-rose-50 text-center">
      <AlertCircle className="w-10 h-10 text-rose-600 mb-2" />
      <h3 className="text-lg font-bold text-rose-900">Application Error</h3>
      <p className="mt-1 text-sm text-rose-700 max-w-md">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={resetErrorBoundary}
        className="mt-4 border-rose-300 text-rose-800 hover:bg-rose-100"
      >
        <RotateCcw className="w-4 h-4 mr-1.5" />
        Reload Section
      </Button>
    </div>
  )
}

export function ErrorBoundary({
  children,
  onReset,
}: {
  children: React.ReactNode
  onReset?: () => void
}) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
      {children}
    </ReactErrorBoundary>
  )
}

