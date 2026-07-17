import React, { createContext, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { notificationAPI } from '../services/api'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [socket, setSocket] = useState(null)

  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const socketUrl = apiUrl.replace(/\/api$/, '')
    const newSocket = io(socketUrl, { transports: ['websocket'] })

    newSocket.on('notification', (notification) => {
      const normalized = {
        ...notification,
        id: notification._id || notification.id,
      }
      setNotifications((prev) => [normalized, ...prev])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      setNotifications([])
      return
    }

    const joinRoom = () => {
      if (!socket) return
      socket.emit('join-room', {
        roomId: user._id,
        userId: user._id,
        userName: user.name,
      })
    }

    const fetchNotifications = async () => {
      try {
        const { data } = await notificationAPI.getNotifications()
        const normalized = data.notifications.map((notification) => ({
          ...notification,
          id: notification._id || notification.id,
        }))
        setNotifications(normalized)
      } catch (error) {
        console.error('Failed to load notifications', error)
      }
    }

    joinRoom()
    fetchNotifications()
  }, [isAuthenticated, user, socket])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (error) {
      console.error('Failed to mark notification read', error)
    }
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = React.useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  )

  const sendNotification = useCallback(
    (userId, notification) => {
      if (socket) {
        socket.emit('send-notification', { userId, notification })
      }
    },
    [socket]
  )

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        clearNotifications,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
