import { Link } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowRight, BookmarkMinus } from 'lucide-react'
import { useGetSavedEvents, useUnsaveEvent } from '../../hooks/useApi'

export default function SavedEvents() {
  const { data, isLoading } = useGetSavedEvents()
  const unsaveEvent = useUnsaveEvent()
  const savedEvents = data?.data?.savedEvents || []

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Saved Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Revisit events you marked for later</p>
          </div>

          {isLoading ? (
            <Card className="p-8 text-center">Loading saved events...</Card>
          ) : savedEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg font-semibold">No saved events yet.</p>
              <p className="text-gray-600 dark:text-gray-400">Save events from the discovery page to see them here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map((event) => (
                <Card key={event._id || event.id} className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase">
                      {event.category}
                    </div>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                  </div>
                  <div className="space-y-2 py-3 border-y border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.registrations || 0} registered</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      to={`/student/event/${event._id}`}
                      className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => unsaveEvent.mutate(event._id)}
                      disabled={unsaveEvent.isLoading}
                    >
                      <BookmarkMinus className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
