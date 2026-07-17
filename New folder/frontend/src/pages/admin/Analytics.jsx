import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function PlatformAnalytics() {
  const eventData = [
    { category: 'Technology', count: 45 },
    { category: 'Entertainment', count: 32 },
    { category: 'Sports', count: 28 },
    { category: 'Academic', count: 38 },
    { category: 'Cultural', count: 29 },
  ]

  const userGrowth = [
    { month: 'Jan', users: 800 },
    { month: 'Feb', users: 1200 },
    { month: 'Mar', users: 1800 },
    { month: 'Apr', users: 2400 },
    { month: 'May', users: 3200 },
    { month: 'Jun', users: 4500 },
  ]

  const roleDistribution = [
    { name: 'Students', value: 4200 },
    { name: 'Organizers', value: 850 },
    { name: 'Admins', value: 12 },
  ]

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981']

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Platform Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor platform performance and growth</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: '5,420' },
              { label: 'Total Events', value: '342' },
              { label: 'Total Registrations', value: '28,450' },
              { label: 'Platform Revenue', value: '₹2.84L' },
            ].map((stat, idx) => (
              <Card key={idx} className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="space-y-6">
              <h3 className="font-bold text-lg">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="space-y-6">
              <h3 className="font-bold text-lg">User Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8b5cf6" dataKey="value">
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="space-y-6">
              <h3 className="font-bold text-lg">Events by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="space-y-4">
              <h3 className="font-bold text-lg">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Avg. Events/Month</span>
                  <span className="font-bold">56</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Avg. Registration/Event</span>
                  <span className="font-bold">83</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Avg. Attendance Rate</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Organizer Satisfaction</span>
                  <span className="font-bold">4.8/5</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
