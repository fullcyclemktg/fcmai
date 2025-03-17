import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/auth/AuthContext'

export default function Dashboard() {
  const { user, dbUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-4 text-center">
          <h1 className="text-xl font-semibold mb-2">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!user || !dbUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-600">
              Logged in as: {user.email}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">User Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {dbUser.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">User ID:</span> {dbUser.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Created:</span> {new Date(dbUser.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Last Updated:</span> {new Date(dbUser.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 