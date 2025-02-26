'use client'

import * as React from "react"
import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { motion } from "framer-motion"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login({ email, password })
      
      // Force router refresh to update UI state
      router.refresh()
      
      // Navigate to account page
      router.push('/account')
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed, please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const inputVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="border-red-500/50 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div 
          className="space-y-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-white pl-10 shadow-sm dark:bg-slate-800/50"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icons.mail className="h-5 w-5" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </Label>
            <a 
              href="/forgot-password" 
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-white pl-10 pr-10 shadow-sm dark:bg-slate-800/50"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icons.lock className="h-5 w-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-2"
        >
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-indigo-400"
          />
          <Label 
            htmlFor="remember" 
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            Remember me
          </Label>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 dark:from-indigo-500 dark:to-indigo-400 dark:hover:from-indigo-400 dark:hover:to-indigo-300"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Or use
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            type="button"
            variant="outline"
            className="flex h-11 items-center justify-center gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Icons.google className="h-4 w-4" />
            <span>Google</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex h-11 items-center justify-center gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Icons.facebook className="h-4 w-4" />
            <span>Facebook</span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
} 