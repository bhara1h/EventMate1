import React, { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Initialize axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  const signup = useCallback(async (formData) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/auth/signup`, formData)
      setToken(data.token)
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      setIsAuthenticated(true)
      toast.success('Account created successfully!')
      return { success: true, user: data.user }
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        'Signup failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      setIsAuthenticated(true)
      toast.success('Logged in successfully!')
      return { success: true, user: data.user }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }, [])

  const forgotPassword = useCallback(async (email) => {
    setLoading(true)
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email })
      toast.success('OTP sent to your email')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const verifyOTP = useCallback(async (email, otp) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp })
      toast.success('OTP verified')
      return { success: true, resetToken: data.resetToken }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true)
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword })
      toast.success('Password reset successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    forgotPassword,
    verifyOTP,
    resetPassword,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
