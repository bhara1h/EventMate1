import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Calendar, MapPin, Users, Share2, Bookmark } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetEventById, useRegisterForEvent } from '../../hooks/useApi'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const { data, isLoading, isError } = useGetEventById(id)
  const registerMutation = useRegisterForEvent()

  const event = data?.data?.event

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync(id)
      toast.success('Registered successfully!')
      setIsRegistered(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  const handleSave = () => {
    setIsSaved((prev) => !prev)
    toast.success(isSaved ? 'Event removed from saved' : 'Event saved!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Event link copied to clipboard!'))
      .catch(() => toast.error('Unable to copy link'))
  }

  if (isLoading) return <LoadingSpinner />

  if (isError || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto text-center text-red-600 dark:text-red-400">
            Failed to load event details.
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
        <div className="max-w-4xl mx-auto space-y-8">
          <button
            onClick={() => navigate('/student/discover')}
            className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
          >
            ← Back to Events
          </button>

          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img
              src={event.poster || 'https://via.placeholder.com/1200x600?text=Event+Banner'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleSave}
                className={`p-3 rounded-lg backdrop-blur-xl transition ${
                  isSaved
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Bookmark className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-lg bg-white/20 text-white hover:bg-white/30 transition backdrop-blur-xl"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">{event.description}</p>
                </div>
                <span className="px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg font-semibold whitespace-nowrap">
                  {event.status === 'approved' ? '✓ Verified' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                      <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.time}</p>
                    </div>
                  </div>
                </Card>

                <Card className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>
                </Card>

                <Card className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Users className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Registrations</p>
                      <p className="font-semibold">{event.registrations} / {event.capacity}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                          style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="space-y-4">
                  <h3 className="font-bold text-lg">Organized by</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={event.organizer?.avatar || 'https://via.placeholder.com/100'}
                      alt={event.organizer?.name || 'Organizer'}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{event.organizer?.name || 'Organizer'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.organizer?.email}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full">
                    Visit Profile
                  </Button>
                </Card>

                <Card className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-gradient">₹{event.fee || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Registration fee</p>
                  </div>
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistered || registerMutation.isLoading}
                    className="w-full"
                  >
                    {isRegistered ? '✓ Registered' : 'Register Now'}
                  </Button>
                  {isRegistered && (
                    <Button variant="secondary" className="w-full">
                      Download QR Ticket
                    </Button>
                  )}
                </Card>
              </div>
            </div>

            <Card className="space-y-4">
              <h3 className="font-bold text-lg">About this event</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{event.longDescription || event.description}</p>
            </Card>

            <div className="flex flex-wrap gap-2">
              {(event.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
