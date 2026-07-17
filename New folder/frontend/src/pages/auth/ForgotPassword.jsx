import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import { Mail, ArrowRight } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await forgotPassword(email)
    setLoading(false)
    
    if (result.success) {
      setSubmitted(true)
      setTimeout(() => navigate('/auth/verify-otp', { state: { email } }), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Forgot Password?</h1>
            <p className="text-gray-600 dark:text-gray-400">No worries, we'll help you reset it</p>
          </div>

          {/* Form */}
          <Card className="space-y-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" isLoading={loading} className="w-full">
                  Send OTP <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Check your email!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent an OTP to {email}. Please check your inbox and enter the code to reset your password.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
