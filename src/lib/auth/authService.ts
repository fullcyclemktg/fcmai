import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { DatabaseUser } from '../types'

export type AuthError = {
  message: string
  status?: number
}

export type AuthResponse<T> = {
  data: T | null
  error: AuthError | null
}

/**
 * Signs in a user with their email using magic link
 * @param email - The user's email address
 * @returns Promise with the sign-in result
 */
export async function signInWithEmail(email: string): Promise<AuthResponse<void>> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      }
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data: null, error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: 'An unexpected error occurred during sign in' }
    }
  }
}

/**
 * Gets the current user session if it exists
 * @returns Promise with the session and user data
 */
export async function getUserSession(): Promise<AuthResponse<{
  session: Session | null
  user: User | null
  dbUser: DatabaseUser | null
}>> {
  try {
    // Get auth session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    // If no session, return early
    if (!session) {
      return { 
        data: { session: null, user: null, dbUser: null }, 
        error: null 
      }
    }

    // Get database user profile
    const { data: dbUser, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError

    return {
      data: {
        session,
        user: session.user,
        dbUser
      },
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error: { 
        message: 'Failed to get user session',
        status: 401
      }
    }
  }
}

/**
 * Signs out the current user
 * @returns Promise indicating success or failure
 */
export async function signOut(): Promise<AuthResponse<void>> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return { data: null, error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: 'Failed to sign out' }
    }
  }
}

/**
 * Updates or creates a user profile in the database
 * @param user - The user object from Supabase Auth
 * @returns Promise with the updated user profile
 */
export async function updateUserProfile(user: User): Promise<AuthResponse<DatabaseUser>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: 'Failed to update user profile' }
    }
  }
} 