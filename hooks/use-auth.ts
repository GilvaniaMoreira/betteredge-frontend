'use client'

import { useEffect } from 'react'
import { authService } from '@/services/auth'
import { useUserStore } from '@/store/user-store'

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setLoading, 
    clearUser, 
    setAuthenticated 
  } = useUserStore()

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('access_token')
    if (token && !user) {
      // Only fetch user info if we have a token but no user data
      setLoading(true)
      authService.getMe()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          clearUser()
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (!token) {
      clearUser()
    } else {
      // User data already exists in store
      setLoading(false)
    }
  }, [user, setUser, setLoading, clearUser])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { access_token } = await authService.login({ email, password })
      localStorage.setItem('access_token', access_token)
      
      // Fetch user info and update store
      const userData = await authService.getMe()
      setUser(userData)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    clearUser()
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}