import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getUserSession, updateUserProfile } from '../../lib/auth/authService'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL
        const errorDescription = router.query.error_description
        if (errorDescription) {
          throw new Error(String(errorDescription))
        }

        // Get the session and ensure it's valid
        const { data, error: sessionError } = await getUserSession()
        if (sessionError) throw sessionError
        if (!data?.session) throw new Error('No session established')

        // Store user data in database
        const { error: profileError } = await updateUserProfile(data.session.user)
        if (profileError) throw profileError

        // Redirect to dashboard on success
        router.replace('/dashboard')
      } catch (error) {
        console.error('Error during auth callback:', error)
        // Show error for 2 seconds before redirecting
        await new Promise(resolve => setTimeout(resolve, 2000))
        router.replace('/')
      }
    }

    // Only run if we have URL parameters
    if (router.isReady) {
      handleAuthCallback()
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 text-center">
        <h1 className="text-xl font-semibold mb-2">Signing you in...</h1>
        <p className="text-gray-600">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
} 