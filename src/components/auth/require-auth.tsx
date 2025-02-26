'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Icons } from '@/components/icons'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only redirect if we've finished loading and there's no user
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        // We've confirmed the user is logged in
        setIsChecking(false)
      }
    }
  }, [user, loading, router])

  // Show loading state while checking auth or while auth provider is loading
  if (loading || isChecking) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait, we are verifying your identity
          </p>
        </div>
      </div>
    )
  }

  // If we're not loading and there's no user, return null (redirect will happen)
  if (!user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
} 