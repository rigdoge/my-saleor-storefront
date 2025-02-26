'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { CURRENT_USER_QUERY, LOGIN_MUTATION, REGISTER_MUTATION } from '@/lib/graphql/queries/auth'
import type { AuthData, LoginInput, RegisterInput, User } from '@/lib/types/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType extends AuthData {
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Get current user information
  const { data: userData, isLoading, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!token) return null
      const response = await graphqlRequestClient(CURRENT_USER_QUERY)
      return response.me as User
    },
    enabled: !!token,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the data (formerly cacheTime)
  })

  // Login
  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      try {
        // Clear old token first
        localStorage.removeItem('authToken')
        
        const response = await graphqlRequestClient(LOGIN_MUTATION, input)
        console.log('Login response:', response)
        
        if (response.tokenCreate.errors?.length) {
          throw new Error(response.tokenCreate.errors[0].message)
        }
        
        // Set new token
        const newToken = response.tokenCreate.token
        if (!newToken) {
          throw new Error('Login failed: No valid token received')
        }
        
        return response.tokenCreate
      } catch (error: any) {
        console.error('Login error:', error)
        throw error
      }
    },
    onSuccess: async (data) => {
      const newToken = data.token
      setToken(newToken)
      localStorage.setItem('authToken', newToken)
      setError(null)
      
      // Refresh user information immediately
      await refetchUser()
      
      // Invalidate all queries to force refetch
      queryClient.invalidateQueries()
    },
    onError: (error: Error) => {
      setError(error)
      // Ensure invalid token is cleared
      setToken(null)
      localStorage.removeItem('authToken')
    },
  })

  // Register
  const registerMutation = useMutation({
    mutationFn: async (input: RegisterInput) => {
      try {
        const response = await graphqlRequestClient(REGISTER_MUTATION, {
          input: {
            email: input.email,
            password: input.password,
            firstName: input.firstName,
            lastName: input.lastName,
            redirectUrl: `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/account/verify`,
            channel: process.env.NEXT_PUBLIC_DEFAULT_CHANNEL,
          }
        })

        console.log('Register response:', response) // Add log

        if (response.accountRegister.errors?.length) {
          const error = response.accountRegister.errors[0]
          throw new Error(error.message || 'Registration failed, please try again later')
        }
        
        // Automatically login after successful registration
        const loginResponse = await graphqlRequestClient(LOGIN_MUTATION, {
          email: input.email,
          password: input.password,
        })

        console.log('Login response:', loginResponse) // Add log

        if (loginResponse.tokenCreate.errors?.length) {
          throw new Error('Registration successful but login failed, please try to login manually')
        }
        
        return {
          user: response.accountRegister.user,
          token: loginResponse.tokenCreate.token,
        }
      } catch (error: any) {
        // Handle network errors or other unexpected errors
        console.error('Registration error:', error)
        if (!error.message) {
          error.message = 'Registration failed, please check your network connection and try again'
        }
        throw error
      }
    },
    onSuccess: (data) => {
      setToken(data.token)
      localStorage.setItem('authToken', data.token)
      setError(null)
      
      // Invalidate all queries to force refetch
      queryClient.invalidateQueries()
    },
    onError: (error: Error) => {
      setError(error)
      console.error('Registration error:', error)
    },
  })

  // Logout
  const logout = () => {
    setToken(null)
    localStorage.removeItem('authToken')
    
    // Clear all cached data
    queryClient.clear()
    
    // Force a router refresh to update UI
    router.refresh()
    
    // Redirect to home page
    router.push('/')
  }

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: userData || null,
        token,
        loading: isLoading,
        error,
        login: async (input: LoginInput) => {
          await loginMutation.mutateAsync(input);
        },
        register: async (input: RegisterInput) => {
          await registerMutation.mutateAsync(input);
        },
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 