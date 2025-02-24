'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { graphqlRequestClient } from '@/lib/graphql/client'
import { CURRENT_USER_QUERY, LOGIN_MUTATION, REGISTER_MUTATION } from '@/lib/graphql/queries/auth'
import type { AuthData, LoginInput, RegisterInput, User } from '@/lib/types/auth'

interface AuthContextType extends AuthData {
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // 获取当前用户信息
  const { data: userData, isLoading, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!token) return null
      const response = await graphqlRequestClient(CURRENT_USER_QUERY)
      return response.me as User
    },
    enabled: !!token,
  })

  // 登录
  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      try {
        // 先清除旧的 token
        localStorage.removeItem('authToken')
        
        const response = await graphqlRequestClient(LOGIN_MUTATION, input)
        console.log('Login response:', response)
        
        if (response.tokenCreate.errors?.length) {
          throw new Error(response.tokenCreate.errors[0].message)
        }
        
        // 设置新的 token
        const newToken = response.tokenCreate.token
        if (!newToken) {
          throw new Error('登录失败：未收到有效的 token')
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
      
      // 重新获取用户信息
      await refetchUser()
    },
    onError: (error: Error) => {
      setError(error)
      // 确保清除无效的 token
      setToken(null)
      localStorage.removeItem('authToken')
    },
  })

  // 注册
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

        console.log('Register response:', response) // 添加日志

        if (response.accountRegister.errors?.length) {
          const error = response.accountRegister.errors[0]
          throw new Error(error.message || '注册失败，请稍后重试')
        }
        
        // 注册成功后自动登录
        const loginResponse = await graphqlRequestClient(LOGIN_MUTATION, {
          email: input.email,
          password: input.password,
        })

        console.log('Login response:', loginResponse) // 添加日志

        if (loginResponse.tokenCreate.errors?.length) {
          throw new Error('注册成功但登录失败，请尝试手动登录')
        }
        
        return {
          user: response.accountRegister.user,
          token: loginResponse.tokenCreate.token,
        }
      } catch (error: any) {
        // 处理网络错误或其他未预期的错误
        console.error('Registration error:', error)
        if (!error.message) {
          error.message = '注册失败，请检查网络连接后重试'
        }
        throw error
      }
    },
    onSuccess: (data) => {
      setToken(data.token)
      localStorage.setItem('authToken', data.token)
      setError(null)
    },
    onError: (error: Error) => {
      setError(error)
      console.error('Registration error:', error)
    },
  })

  // 登出
  const logout = () => {
    setToken(null)
    localStorage.removeItem('authToken')
  }

  // 初始化时从 localStorage 恢复 token
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
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
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