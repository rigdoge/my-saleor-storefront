'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/components/providers/auth-provider"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="container relative min-h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">Saleor商城</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              欢迎回来！登录您的账户，开启愉快的购物之旅。
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              登录账户
            </h1>
            <p className="text-sm text-muted-foreground">
              输入您的邮箱和密码登录
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            还没有账户？{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 