'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Category page error:', error)
  }, [error])

  return (
    <div className="container py-10">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while loading the category page. Please try again later.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-bold">Page Load Failed</h1>
        <p className="mt-2 text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={reset}>
            Try Again
          </Button>
          <Link href="/" passHref>
            <Button variant="outline">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 