import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import EventCard from '../../components/common/EventCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetEvents, useRegisterForEvent } from '../../hooks/useApi'

export default function EventDiscovery() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, isError } = useGetEvents({
    search: searchQuery,
    category: selectedCategory,
  })

  const registerMutation = useRegisterForEvent()

  const events = data?.data?.events || []

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [events, searchQuery])

  const handleRegister = async (eventId) => {
    try {
      await registerMutation.mutateAsync(eventId)
      toast.success('Registered successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto text-center text-red-600 dark:text-red-400">
            Failed to load events. Please refresh the page.
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gradient">Discover Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Find amazing events happening at your college</p>
          </div>

          <Card className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-2">
                {['all', 'Technology', 'Entertainment', 'Sports', 'Academic', 'Cultural'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300'}`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => navigate(`/student/event/${event._id}`)}
                  onRegister={() => handleRegister(event._id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No events match your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
