import { Loader } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <div className="text-center">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  )
}
