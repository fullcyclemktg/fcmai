import { useState } from 'react'
import { useAuth } from '../lib/auth/AuthContext'

export default function AuthTest() {
  const { user, signIn, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)
    
    try {
      const { error } = await signIn(email)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the magic link!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await logout()
      if (error) {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {user ? (
        <div className="space-y-4">
          <p className="text-green-600">Logged in as: {user.email}</p>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm">{message}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
          </button>
        </form>
      )}
    </div>
  )
} 