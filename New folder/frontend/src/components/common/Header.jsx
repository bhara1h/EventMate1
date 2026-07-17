import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { Moon, Sun, LogOut, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const { unreadCount } = useNotification()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRoleBasedLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Discover Events', href: '/student/discover' },
          { label: 'My Events', href: '/student/registered-events' },
        ]
      case 'organizer':
        return [
          { label: 'Dashboard', href: '/organizer/dashboard' },
          { label: 'Create Event', href: '/organizer/create-event' },
          { label: 'My Events', href: '/organizer/manage-events' },
        ]
      case 'admin':
        return [
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Verify Events', href: '/admin/verify-events' },
          { label: 'Analytics', href: '/admin/analytics' },
        ]
      default:
        return []
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-gradient">
            <span>⚡</span>EventMate
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && getRoleBasedLinks().map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 hover:bg-white/10 dark:hover:bg-gray-800/10 rounded-lg transition"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 dark:hover:bg-gray-800/10 rounded-lg transition"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/auth/login" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-glow transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-white/10 dark:hover:bg-gray-800/10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20 dark:border-gray-700/20 space-y-3">
            {isAuthenticated ? (
              <>
                {getRoleBasedLinks().map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-2 hover:bg-white/10 dark:hover:bg-gray-800/10 rounded-lg transition"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="block px-4 py-2 hover:bg-white/10 dark:hover:bg-gray-800/10 rounded-lg">
                  Login
                </Link>
                <Link to="/auth/signup" className="block px-4 py-2 bg-purple-600 text-white rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
