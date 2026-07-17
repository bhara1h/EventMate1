import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGetPlatformStats } from '../../hooks/useApi'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Users, Calendar, TrendingUp, AlertTriangle, BarChart3, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isError } = useGetPlatformStats()

  const stats = {
    totalUsers: data?.data?.stats?.totalUsers ?? 0,
    totalEvents: data?.data?.stats?.totalEvents ?? 0,
    pendingVerification: data?.data?.stats?.pendingEvents ?? 0,
    suspiciousActivities: 3,
  }

  const chartData = [
    { day: 'Mon', events: 45, users: 120 },
    { day: 'Tue', events: 52, users: 140 },
    { day: 'Wed', events: 48, users: 135 },
    { day: 'Thu', events: 61, users: 155 },
    { day: 'Fri', events: 73, users: 180 },
    { day: 'Sat', events: 85, users: 200 },
    { day: 'Sun', events: 70, users: 165 },
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
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-6 h-6" />, label: 'Total Users', value: stats.totalUsers },
              { icon: <Calendar className="w-6 h-6" />, label: 'Total Events', value: stats.totalEvents },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Pending Verification', value: stats.pendingVerification, highlight: true },
              { icon: <AlertTriangle className="w-6 h-6" />, label: 'Suspicious Activities', value: stats.suspiciousActivities, highlight: true },
            ].map((stat, idx) => (
              <Card
                key={idx}
                className={`space-y-3 ${stat.highlight ? 'border-2 border-red-500/30' : ''}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
                  stat.highlight
                    ? 'bg-gradient-to-br from-red-500 to-orange-500'
                    : 'bg-gradient-to-br from-purple-500 to-blue-500'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/admin/verify-events')}
                  className="w-full justify-start"
                  variant="secondary"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify Events
                </Button>
                <Button
                  onClick={() => navigate('/admin/users')}
                  className="w-full justify-start"
                  variant="secondary"
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
                <Button
                  onClick={() => navigate('/admin/fraud-detection')}
                  className="w-full justify-start"
                  variant="secondary"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Fraud Detection
                </Button>
              </div>
            </Card>

            {/* Alert Card */}
            <Card className="md:col-span-2 border-2 border-yellow-500/30 space-y-3">
              <h3 className="font-bold text-lg">Alerts & Notifications</h3>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 rounded">
                  <p className="text-sm"><strong>{stats.pendingVerification} events</strong> pending verification</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded">
                  <p className="text-sm"><strong>{stats.suspiciousActivities} suspicious activities</strong> detected</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded">
                  <p className="text-sm"><strong>5 new organizers</strong> awaiting approval</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <Card className="space-y-6">
            <h3 className="font-bold text-lg">Platform Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} name="Events" />
                <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
