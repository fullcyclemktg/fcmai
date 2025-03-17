import { supabase } from '../supabase'
import { type User } from '@supabase/supabase-js'
import { type DatabaseUser } from '../types'

export type SignInData = {
  email: string
}

// Helper function to store user data in the users table
async function storeUserData(user: User): Promise<{ data: DatabaseUser | null; error: any }> {
  const userData = {
    id: user.id,
    email: user.email,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(userData)
    .select()
    .single()

  return { data, error }
}

// Helper function to fetch user data from the users table
export async function fetchUserData(userId: string): Promise<{ data: DatabaseUser | null; error: any }> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function signInWithMagicLink({ email }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      }
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getUserSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }

    // If we have a session, store/update the user data
    if (session?.user) {
      await storeUserData(session.user)
    }

    return { session, error: null }
  } catch (error) {
    return { session: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }

    return { error: null }
  } catch (error) {
    return { error }
  }
} 