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
import { EyeIcon, EyeOffIcon, UserIcon, AtSignIcon } from "lucide-react"

export function RegisterForm() {
  const { register } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate terms agreement
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    setIsLoading(true)

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed, please try again")
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

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="space-y-2"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              First Name
            </Label>
            <div className="relative">
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 bg-white pl-10 shadow-sm dark:bg-slate-800/50"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.15 }}
          >
            <Label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Last Name
            </Label>
            <div className="relative">
              <Input
                id="lastName"
                type="text"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 bg-white pl-10 shadow-sm dark:bg-slate-800/50"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="space-y-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
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
              <AtSignIcon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.25 }}
        >
          <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </Label>
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Password must be at least 8 characters, including letters and numbers
          </p>
        </motion.div>

        <motion.div 
          className="space-y-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-11 bg-white pl-10 pr-10 shadow-sm dark:bg-slate-800/50"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icons.lock className="h-5 w-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirmPassword ? (
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
          transition={{ delay: 0.35 }}
          className="flex items-start space-x-2"
        >
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-indigo-400"
            />
          </div>
          <div className="text-sm">
            <Label 
              htmlFor="terms" 
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              I agree to the 
              <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Terms of Service
              </a>
              {" "}and{" "}
              <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Privacy Policy
              </a>
            </Label>
          </div>
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
            className="h-11 w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-500 hover:to-indigo-400 dark:from-purple-500 dark:to-indigo-400 dark:hover:from-purple-400 dark:hover:to-indigo-300"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.45 }}
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
          transition={{ delay: 0.5 }}
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