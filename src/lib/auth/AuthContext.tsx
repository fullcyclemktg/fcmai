import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { type DatabaseUser } from '../types'
import { supabase } from '../supabase'
import { signInWithEmail, signOut as authSignOut, getUserSession, updateUserProfile } from './authService'

type AuthContextType = {
  user: User | null
  session: Session | null
  dbUser: DatabaseUser | null
  loading: boolean
  signIn: (email: string) => Promise<{ error: any }>
  logout: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize session and set up refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await getUserSession()
        if (error) throw error
        
        if (data) {
          setSession(data.session)
          setUser(data.user)
          setDbUser(data.dbUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data } = await updateUserProfile(session.user)
        setDbUser(data)
      } else {
        setDbUser(null)
      }
      
      setLoading(false)
    })

    // Set up session refresh interval
    const refreshInterval = setInterval(async () => {
      const { data } = await getUserSession()
      if (data) {
        setSession(data.session)
        setUser(data.user)
        setDbUser(data.dbUser)
      }
    }, 1000 * 60 * 60) // Refresh every hour

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [])

  const value = {
    user,
    session,
    dbUser,
    loading,
    signIn: async (email: string) => {
      const { error } = await signInWithEmail(email)
      return { error }
    },
    logout: async () => {
      const { error } = await authSignOut()
      if (!error) {
        setUser(null)
        setSession(null)
        setDbUser(null)
      }
      return { error }
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 