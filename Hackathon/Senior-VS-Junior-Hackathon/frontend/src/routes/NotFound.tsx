import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        404
      </h1>
      <h2 className="mt-2 text-lg font-medium text-zinc-700 dark:text-zinc-300">
        Page Not Found
      </h2>
      <p className="mt-1 text-sm text-zinc-500 max-w-sm">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="default" size="md">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
export default NotFound

