import { useEffect } from 'react'
import { useGetPendingEvents, useApproveEvent, useRejectEvent } from '../../hooks/useApi'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Check, X, Eye, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EventVerification() {
  const { data, isLoading, isError } = useGetPendingEvents()
  const approveEvent = useApproveEvent()
  const rejectEvent = useRejectEvent()

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load pending events')
    }
  }, [isError])

  const events = data?.data?.events || []

  const handleApprove = async (eventId) => {
    approveEvent.mutate(eventId, {
      onSuccess: () => {
        toast.success('Event approved!')
      },
      onError: () => {
        toast.error('Failed to approve event')
      },
    })
  }

  const handleReject = async (eventId) => {
    const reason = window.prompt('Enter rejection reason', 'Incomplete event details')
    if (!reason) return

    rejectEvent.mutate({ eventId, reason }, {
      onSuccess: () => {
        toast.success('Event rejected')
      },
      onError: () => {
        toast.error('Failed to reject event')
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Event Verification</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve pending events</p>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">Loading pending events...</p>
              </Card>
            ) : events.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No pending events for verification</p>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event._id} className={`space-y-4 ${event.status !== 'pending' ? 'opacity-60' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>🏢 {event.organizer?.name || event.organizer}</div>
                        <div>📁 {event.category}</div>
                        <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold
                      ${event.status === 'approved'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : event.status === 'rejected'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }
                    `}>
                      {event.status}
                    </span>
                  </div>

                  {event.concerns && event.concerns.length > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
                        <AlertCircle className="w-5 h-5" />
                        Concerns
                      </div>
                      <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                        {event.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => handleApprove(event._id)}
                        className="flex-1"
                      >
                        <Check className="w-4 h-4" />
                        Approve Event
                      </Button>
                      <Button
                        onClick={() => handleReject(event._id)}
                        variant="danger"
                        className="flex-1"
                      >
                        <X className="w-4 h-4" />
                        Reject Event
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-4"
                      >
                        <Eye className="w-4 h-4" />
                        Details
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
