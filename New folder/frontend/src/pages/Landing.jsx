import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import Button from '../components/common/Button'
import { ArrowRight, Calendar, Users, Zap, TrendingUp, Shield, Bell } from 'lucide-react'
import { useEffect } from 'react'

export default function Landing() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin/dashboard')
      else if (user?.role === 'organizer') navigate('/organizer/dashboard')
      else navigate('/student/dashboard')
    }
  }, [isAuthenticated])

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Discover Events',
      description: 'Find amazing college events happening near you with smart filters and recommendations'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Quick Registration',
      description: 'Register for events in seconds and get instant QR tickets for hassle-free entry'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Event Management',
      description: 'Organize events with ease - manage registrations, attendance, and analytics'
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications about events, registrations, and updates'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights and analytics about event performance and attendance'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'Enterprise-grade security with JWT authentication and encrypted data handling'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    <span className="text-gradient">Smart Event Planning</span>
                    {' '}Made Easy
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Discover, organize, and attend college events with EventMate. The all-in-one platform for students, organizers, and admins.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth/signup">
                    <Button className="w-full sm:w-auto">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <button className="px-6 py-3 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 font-semibold transition">
                    Learn More
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">5000+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">50K+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">100+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Colleges</p>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative h-96 md:h-full hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl opacity-10 blur-3xl"></div>
                <div className="absolute inset-0 glass rounded-3xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-lg font-semibold">Beautiful & Modern UI</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Works on all devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to discover, create, and manage events seamlessly
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 space-y-4 hover:-translate-y-2 transition">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">Join thousands of students and organizers discovering and creating amazing events</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="ghost" className="text-white border border-white hover:bg-white/10 w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
