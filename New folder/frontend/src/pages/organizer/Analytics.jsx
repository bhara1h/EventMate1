import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import { useGetOrganizerEvents } from '../../hooks/useApi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function EventAnalytics() {
  const { data, isLoading } = useGetOrganizerEvents()
  const organizerEvents = data?.data?.events || []

  const totalRegistrations = organizerEvents.reduce((sum, event) => sum + (event.registrations || 0), 0)
  const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event.revenue || 0), 0)
  const totalAttendance = organizerEvents.reduce((sum, event) => sum + (event.attendanceCount || 0), 0)
  const totalEvents = organizerEvents.length
  const noShowRate = totalRegistrations > 0 ? (((totalRegistrations - totalAttendance) / totalRegistrations) * 100).toFixed(1) : '0.0'

  const registrationData = organizerEvents.map((event) => ({
    name: event.title,
    registrations: event.registrations || 0,
  }))

  const attendanceData = [
    { name: 'Attended', value: totalAttendance },
    { name: 'No-show', value: Math.max(totalRegistrations - totalAttendance, 0) },
  ]

  const COLORS = ['#8b5cf6', '#ef4444']

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Event Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor engagement and revenue across your events</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Total Events', value: totalEvents },
              { label: 'Total Registrations', value: totalRegistrations },
              { label: 'Total Attendance', value: totalAttendance },
              { label: 'No-show Rate', value: `${noShowRate}%` },
            ].map((stat, idx) => (
              <Card key={idx} className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="space-y-6">
              <h3 className="font-bold text-lg">Registration Trends</h3>
              {isLoading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
              ) : organizerEvents.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No events found yet. Create an event to start tracking performance.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="registrations" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card className="space-y-6">
              <h3 className="font-bold text-lg">Attendance Overview</h3>
              {isLoading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
              ) : organizerEvents.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No attendance data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={attendanceData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8b5cf6" dataKey="value">
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
