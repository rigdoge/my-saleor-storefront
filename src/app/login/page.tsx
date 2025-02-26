'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/components/providers/auth-provider"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // If user is already logged in, redirect to homepage
  useEffect(() => {
    if (!loading && user) {
      setIsRedirecting(true)
      router.push('/')
    }
  }, [user, loading, router])

  // If redirecting or loading, show nothing to prevent flash of content
  if (loading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Image 
                src="/icons/logo.svg" 
                alt="Logo" 
                width={48} 
                height={48} 
                className="h-12 w-12" 
              />
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground">
            {isRedirecting ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container relative flex min-h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left decoration area */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden h-full flex-col overflow-hidden rounded-l-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-10 text-white lg:flex"
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-10" 
               style={{ backgroundImage: "url('/images/auth-pattern.svg')" }} />
          
          <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
            <div className="rounded-full bg-white/10 p-1">
              <Image 
                src="/icons/logo.svg" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8" 
              />
            </div>
            <Link href="/" className="text-xl font-bold">Saleor Store</Link>
          </div>
          
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-6">
              <p className="text-xl font-medium leading-relaxed">
                "Shopping is not just a transaction, but a lifestyle. Here, we provide you with the highest quality shopping experience."
              </p>
              <footer className="text-sm">
                <div className="font-medium">Welcome back!</div>
                <div className="mt-1 text-white/70">Log in to your account to start your pleasant shopping journey.</div>
              </footer>
            </blockquote>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-32 -left-40 z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-32 -right-40 z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </motion.div>
        
        {/* Right login form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:p-8"
        >
          <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Please enter your account information to log in
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  Account Login
                </span>
              </div>
            </div>
            
            <LoginForm />
            
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Register Now
              </Link>
            </p>
            
            <div className="flex items-center justify-center">
              <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                Return to Home
              </Link>
              <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
              <Link href="/help" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                Need Help?
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 