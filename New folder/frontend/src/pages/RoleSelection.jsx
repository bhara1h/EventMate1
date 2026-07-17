import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { BookOpen, Users, Shield } from 'lucide-react'
import { useState } from 'react'

export default function RoleSelection() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)

  const roles = [
    {
      id: 'student',
      icon: <BookOpen className="w-12 h-12" />,
      title: 'Student',
      description: 'Discover events, register, get QR tickets, and find amazing experiences',
      features: ['Event Discovery', 'Quick Registration', 'QR Tickets', 'Notifications', 'Certificates']
    },
    {
      id: 'organizer',
      icon: <Users className="w-12 h-12" />,
      title: 'Event Organizer',
      description: 'Create and manage events, track attendance, and grow your audience',
      features: ['Create Events', 'QR Attendance', 'Analytics', 'Participant Management', 'Revenue Tracking']
    },
    {
      id: 'admin',
      icon: <Shield className="w-12 h-12" />,
      title: 'Admin',
      description: 'Verify events, manage users, detect fraud, and monitor platform',
      features: ['Event Verification', 'User Management', 'Analytics', 'Fraud Detection', 'Reports']
    },
  ]

  const handleContinue = (role) => {
    setSelectedRole(role)
    setTimeout(() => {
      navigate('/auth/signup', { state: { role } })
    }, 300)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gradient mb-4">Choose Your Role</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Select how you want to use EventMate
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`flex flex-col space-y-6 hover:shadow-glow transition cursor-pointer
                  ${selectedRole === role.id ? 'ring-2 ring-purple-500' : ''}
                `}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                  {role.icon}
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{role.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {role.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 flex-1 py-4 border-y border-gray-200 dark:border-gray-700">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-purple-600 dark:text-purple-400">✓</span>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleContinue(role.id)}
                  className="w-full"
                  variant={selectedRole === role.id ? 'primary' : 'secondary'}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>

          {/* Info Text */}
          <div className="mt-12 p-6 glass rounded-2xl text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can change your role later in your account settings
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
