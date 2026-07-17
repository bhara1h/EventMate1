import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Calendar, TrendingUp, BookmarkCheck, Bell, BarChart3, Award, Search } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useGetMyRegistrations } from '../../hooks/useApi'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError } = useGetMyRegistrations()

  const registrations = data?.data?.registrations || []

  const upcomingEvents = useMemo(
    () => registrations
      .filter((item) => new Date(item.event.date) >= new Date())
      .slice(0, 4)
      .map((item) => ({
        id: item._id,
        title: item.event.title,
        date: item.event.date,
        location: item.event.location,
        registrations: item.event.registrations,
      })),
    [registrations]
  )

  const chartData = useMemo(() => {
    const counts = registrations.reduce((acc, item) => {
      const month = new Date(item.event.date).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts).map(([month, events]) => ({ month, events }))
  }, [registrations])

  const stats = useMemo(() => ({
    registeredEvents: registrations.length,
    savedEvents: Math.max(0, Math.floor(registrations.length / 2)),
    certificates: Math.max(0, Math.floor(registrations.length / 3)),
    upcomingEvents: upcomingEvents.length,
  }), [registrations.length, upcomingEvents.length])

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto text-center text-red-600 dark:text-red-400">
            Failed to load dashboard data.
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
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Calendar className="w-6 h-6" />, label: 'Registered Events', value: stats.registeredEvents },
              { icon: <BookmarkCheck className="w-6 h-6" />, label: 'Saved Events', value: stats.savedEvents },
              { icon: <Award className="w-6 h-6" />, label: 'Certificates', value: stats.certificates },
              { icon: <TrendingUp className="w-6 h-6" />, label: 'Upcoming Events', value: stats.upcomingEvents },
            ].map((stat, idx) => (
              <Card key={idx} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">+12%</span>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <h3 className="text-lg font-bold mb-6">Event Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.length ? chartData : [{ month: 'Now', events: 0 }] }>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="secondary">
                  <Search className="w-4 h-4" />
                  Discover Events
                </Button>
                <Button className="w-full" variant="secondary">
                  <Bell className="w-4 h-4" />
                  Notifications
                </Button>
                <Button className="w-full" variant="secondary">
                  <BarChart3 className="w-4 h-4" />
                  My Profile
                </Button>
              </div>
            </Card>
          </div>

          <Card className="space-y-6">
            <h3 className="text-lg font-bold">Upcoming Events</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="glass rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{event.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full">
                        Registered
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>👥 {event.registrations || 0} attending</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8">
                  No upcoming events available yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
