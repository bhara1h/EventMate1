import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI, eventAPI, adminAPI, notificationAPI, userAPI, certificateAPI } from '../services/api'

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token)
    },
  })
}

export const useSignup = () => {
  return useMutation({
    mutationFn: authAPI.signup,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('token')
      queryClient.clear()
    },
  })
}

export const useGetMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: authAPI.getMe,
    enabled: !!localStorage.getItem('token'),
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authAPI.forgotPassword,
  })
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({ email, otp }) => authAPI.verifyOTP(email, otp),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }) => authAPI.resetPassword(token, newPassword),
  })
}

// Event Hooks
export const useGetEvents = (params) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventAPI.getEvents(params),
  })
}

export const useGetEventById = (id) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventAPI.getEventById(id),
    enabled: !!id,
  })
}

export const useGetOrganizerEvents = () => {
  return useQuery({
    queryKey: ['events', 'organizer'],
    queryFn: eventAPI.getOrganizerEvents,
    enabled: !!localStorage.getItem('token'),
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eventAPI.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export const useUpdateEvent = (id) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => eventAPI.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', id] })
    },
  })
}

export const useDeleteEvent = (id) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => eventAPI.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId) => eventAPI.registerForEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] })
    },
  })
}

export const useGetMyRegistrations = () => {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: eventAPI.getMyRegistrations,
    enabled: !!localStorage.getItem('token'),
  })
}

export const useGetEventParticipants = (eventId) => {
  return useQuery({
    queryKey: ['participants', eventId],
    queryFn: () => eventAPI.getEventParticipants(eventId),
    enabled: !!eventId,
  })
}

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationAPI.getNotifications,
    enabled: !!localStorage.getItem('token'),
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['user', 'saved-events'] })
    },
  })
}

export const useGetSavedEvents = () => {
  return useQuery({
    queryKey: ['user', 'saved-events'],
    queryFn: userAPI.getSavedEvents,
    enabled: !!localStorage.getItem('token'),
  })
}

export const useSaveEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId) => userAPI.saveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'saved-events'] })
    },
  })
}

export const useUnsaveEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId) => userAPI.unsaveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'saved-events'] })
    },
  })
}

export const useGetCertificates = () => {
  return useQuery({
    queryKey: ['user', 'certificates'],
    queryFn: certificateAPI.getMyCertificates,
    enabled: !!localStorage.getItem('token'),
  })
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId) => notificationAPI.markAsRead(notificationId),
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData?.data?.notifications) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            notifications: oldData.data.notifications.map((notification) =>
              notification._id === notificationId || notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
          },
        }
      })
    },
  })
}

// Admin Hooks
export const useGetPendingEvents = () => {
  return useQuery({
    queryKey: ['admin', 'pending-events'],
    queryFn: adminAPI.getPendingEvents,
  })
}

export const useApproveEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId) => adminAPI.approveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-events'] })
    },
  })
}

export const useRejectEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, reason }) => adminAPI.rejectEvent(eventId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-events'] })
    },
  })
}

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminAPI.getUsers,
  })
}

export const useSuspendUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId) => adminAPI.suspendUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useUnsuspendUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId) => adminAPI.unsuspendUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId) => adminAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useGetPlatformStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminAPI.getPlatformStats,
  })
}

export const useGetSuspiciousActivities = () => {
  return useQuery({
    queryKey: ['admin', 'fraud'],
    queryFn: adminAPI.getSuspiciousActivities,
  })
}

export const useReportSuspiciousActivity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.reportSuspiciousActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'fraud'] })
    },
  })
}
