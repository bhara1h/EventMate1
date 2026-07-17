import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Edit2, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetOrganizerEvents, useDeleteEvent } from '../../hooks/useApi'

export default function ManageEvents() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetOrganizerEvents()
  const deleteMutation = useDeleteEvent()

  const events = data?.data?.events || []

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      await deleteMutation.mutateAsync(eventId)
      toast.success('Event deleted successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-gray-600 dark:text-gray-400">Loading your events...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto text-center text-red-600 dark:text-red-400">
            Failed to load your events.
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Manage Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Create, edit, and manage your events</p>
          </div>

          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event._id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                      <div>👥 {event.registrations}/{event.capacity} registered</div>
                      <div>💰 ₹{event.revenue || 0}</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/organizer/edit-event/${event._id}`)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/organizer/attendance/${event._id}`)}
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(event._id)}
                      isLoading={deleteMutation.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">You have not created any events yet.</p>
                <Button onClick={() => navigate('/organizer/create-event')}>Create your first event</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
