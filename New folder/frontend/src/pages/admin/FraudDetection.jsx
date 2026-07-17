import { useEffect, useState } from 'react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { AlertTriangle, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetSuspiciousActivities } from '../../hooks/useApi'

export default function FraudDetection() {
  const { data, isLoading } = useGetSuspiciousActivities()
  const [activities, setActivities] = useState([])

  useEffect(() => {
    if (data?.data?.activities) {
      setActivities(data.data.activities)
    }
  }, [data])

  const handleReview = (id) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity._id === id ? { ...activity, status: 'reviewed' } : activity
      )
    )
    toast.success('Activity reviewed')
  }

  const handleBlock = (id) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity._id === id ? { ...activity, status: 'blocked' } : activity
      )
    )
    toast.success('User blocked')
  }

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/20 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'high':
        return 'border-orange-500/20 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      case 'medium':
        return 'border-yellow-500/20 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      default:
        return 'border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Fraud Detection</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor suspicious activities across the platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="space-y-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Critical Alerts</p>
                  <p className="text-3xl font-bold">{activities.filter((activity) => activity.severity === 'critical').length}</p>
                </div>
              </div>
            </Card>
            <Card className="space-y-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                  <p className="text-3xl font-bold">{activities.filter((activity) => activity.severity === 'high').length}</p>
                </div>
              </div>
            </Card>
            <Card className="space-y-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</p>
                  <p className="text-3xl font-bold">{activities.filter((activity) => activity.severity === 'medium').length}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <Card className="p-8 text-center">Loading suspicious activity...</Card>
            ) : activities.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-lg font-semibold">No suspicious activity detected.</p>
                <p className="text-gray-600 dark:text-gray-400">Check back after more platform activity is recorded.</p>
              </Card>
            ) : (
              activities.map((activity) => (
                <Card key={activity._id} className={`${getSeverityStyles(activity.severity)} border p-6`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 lg:max-w-3xl">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">{activity.type}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {activity.severity?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User: <strong>{activity.user?.name || activity.user || 'Unknown'}</strong>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Detected: {new Date(activity.createdAt || activity.detectedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {activity.status || 'pending'}
                    </span>
                  </div>

                  {(activity.status === 'pending' || activity.status === 'flagged') && (
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button onClick={() => handleReview(activity._id)} variant="secondary" className="flex-1">
                        Mark as Reviewed
                      </Button>
                      <Button onClick={() => handleBlock(activity._id)} variant="danger" className="flex-1">
                        <Lock className="w-4 h-4" />
                        Block User
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
