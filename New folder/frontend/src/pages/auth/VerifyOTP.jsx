import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { ArrowRight } from 'lucide-react'

export default function VerifyOTP() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyOTP, forgotPassword } = useAuth()

  useEffect(() => {
    const initialEmail = location.state?.email || ''
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [location.state])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }

    setError('')
    setLoading(true)
    const result = await verifyOTP(email, otp)
    setLoading(false)
    
    if (result.success) {
      navigate('/auth/reset-password/' + result.resetToken)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('Enter your email address to resend OTP')
      return
    }

    setError('')
    setInfoMessage('')
    setLoading(true)
    const result = await forgotPassword(email)
    setLoading(false)

    if (result.success) {
      setInfoMessage('OTP resent to your email.')
      setCooldown(60)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Verify OTP</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter the 6-digit code sent to your email</p>
          </div>

          <Card className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    border-gray-200 dark:border-gray-700
                    focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  OTP Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border-2
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    border-gray-200 dark:border-gray-700
                    focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {infoMessage && <p className="text-sm text-green-600">{infoMessage}</p>}

              <Button type="submit" isLoading={loading} className="w-full">
                Verify OTP <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-between pt-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Didn't receive it?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || cooldown > 0}
                  className={`font-semibold text-purple-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
