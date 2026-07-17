import { useState, useEffect } from 'react'
import { useGetUsers, useSuspendUser, useUnsuspendUser, useDeleteUser } from '../../hooks/useApi'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Trash2, Lock, Shield, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const { data, isError } = useGetUsers()
  const suspendUser = useSuspendUser()
  const unsuspendUser = useUnsuspendUser()
  const deleteUser = useDeleteUser()

  const users = data?.data?.users || []

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load users')
    }
  }, [isError])

  const handleSuspend = (id) => {
    suspendUser.mutate(id, {
      onSuccess: () => {
        toast.success('User suspended')
      },
      onError: () => {
        toast.error('Failed to suspend user')
      },
    })
  }

  const handleUnsuspend = (id) => {
    unsuspendUser.mutate(id, {
      onSuccess: () => {
        toast.success('User unsuspended')
      },
      onError: () => {
        toast.error('Failed to unsuspend user')
      },
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(id, {
        onSuccess: () => {
          toast.success('User deleted')
        },
        onError: () => {
          toast.error('Failed to delete user')
        },
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage platform users and their access</p>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt || user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.isSuspended
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-green-500/10 text-green-600 dark:text-green-400'
                    }`}>
                      {user.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {user.isSuspended ? (
                        <button
                          onClick={() => handleUnsuspend(user._id)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 rounded"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(user._id)}
                          className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
