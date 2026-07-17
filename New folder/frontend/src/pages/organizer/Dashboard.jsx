import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGetOrganizerEvents } from '../../hooks/useApi'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Calendar, Users, TrendingUp, Eye, BarChart3, Plus, Edit2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetOrganizerEvents()

  const events = data?.data?.events || []
  const stats = {
    totalEvents: events.length,
    totalRegistrations: events.reduce((total, event) => total + (event.registrations || 0), 0),
    totalRevenue: events.reduce(
      (total, event) =>
        total + (event.revenue || event.fee * (event.registrations || 0) || 0),
      0
    ),
    pendingApproval: events.filter((event) => event.status === 'pending').length,
  }

  const chartData =
    events.length > 0
      ? events.slice(-5).map((event) => ({
          week: new Date(event.date).toLocaleDateString(),
          registrations: event.registrations || 0,
        }))
      : [
          { week: 'Week 1', registrations: 0 },
          { week: 'Week 2', registrations: 0 },
          { week: 'Week 3', registrations: 0 },
          { week: 'Week 4', registrations: 0 },
        ]

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load dashboard')
    }
  }, [isError])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gradient">Welcome, {user?.name}!</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your events and track performance</p>
            </div>
            <Button onClick={() => navigate('/organizer/create-event')}>
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Calendar className="w-6 h-6" />, label: 'Total Events', value: stats.totalEvents },
              { icon: <Users className="w-6 h-6" />, label: 'Total Registrations', value: stats.totalRegistrations },
              { icon: <TrendingUp className="w-6 h-6" />, label: 'Total Revenue', value: `₹${stats.totalRevenue}` },
              { icon: <Eye className="w-6 h-6" />, label: 'Pending Approval', value: stats.pendingApproval },
            ].map((stat, idx) => (
              <Card key={idx} className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts and Events */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Chart */}
            <Card className="md:col-span-2 space-y-6">
              <h3 className="font-bold text-lg">Registration Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="registrations" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Quick Actions */}
            <Card className="space-y-4">
              <h3 className="font-bold text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="secondary">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
                <Button className="w-full" variant="secondary">
                  <Users className="w-4 h-4" />
                  Participants
                </Button>
                <Button className="w-full" variant="secondary">
                  <Edit2 className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            </Card>
          </div>

          {/* My Events */}
          <Card className="space-y-6">
            <h3 className="font-bold text-lg">My Events</h3>
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                  No events found yet. Create your first event to get started.
                </div>
              ) : (
                events.map((event) => (
                  <div key={event._id} className="glass rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold">{event.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(event.registrations || 0)} registrations • ₹{event.revenue || event.fee * (event.registrations || 0)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${event.status === 'approved'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }
                      `}>
                        {event.status}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/organizer/edit-event/${event._id}`)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
