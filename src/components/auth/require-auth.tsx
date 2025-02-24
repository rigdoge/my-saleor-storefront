'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">正在加载...</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            请稍候，我们正在验证您的身份
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
} 