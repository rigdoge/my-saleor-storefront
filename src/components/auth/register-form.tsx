'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/icons'
import { testApiConnection } from '@/lib/graphql/client'

export function RegisterForm() {
  const router = useRouter()
  const { register, error: authError, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
  })
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    error?: string;
  }>({ connected: false })

  // 测试 API 连接
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await testApiConnection()
        console.log('API Status:', response)
        setApiStatus({ connected: true })
      } catch (error: any) {
        console.error('API Connection Error:', error)
        setApiStatus({
          connected: false,
          error: error.message || '无法连接到服务器'
        })
      }
    }

    checkApiConnection()
  }, [])

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const validateForm = () => {
    if (!email) {
      setFormError('请输入邮箱地址')
      return false
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setFormError('请输入有效的邮箱地址')
      return false
    }
    if (!password) {
      setFormError('请输入密码')
      return false
    }
    if (password.length < 8) {
      setFormError('密码长度必须至少为8个字符')
      return false
    }
    if (!firstName) {
      setFormError('请输入名字')
      return false
    }
    if (!lastName) {
      setFormError('请输入姓氏')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // 标记所有字段为已触碰
    setTouched({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
    })

    if (!validateForm()) {
      return
    }

    try {
      await register({ email, password, firstName, lastName })
      // 注册成功后跳转到个人中心页面
      router.push('/account')
    } catch (error: any) {
      console.error('Registration error:', error)
      setFormError(error.message || '注册失败，请稍后重试')
    }
  }

  const getFieldError = (field: keyof typeof touched) => {
    if (!touched[field]) return null
    switch (field) {
      case 'email':
        if (!email) return '邮箱地址不能为空'
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return '请输入有效的邮箱地址'
        break
      case 'password':
        if (!password) return '密码不能为空'
        if (password.length < 8) return '密码长度必须至少为8个字符'
        break
      case 'firstName':
        if (!firstName) return '名字不能为空'
        break
      case 'lastName':
        if (!lastName) return '姓氏不能为空'
        break
    }
    return null
  }

  return (
    <div className="grid gap-6">
      {!apiStatus.connected && apiStatus.error && (
        <Alert variant="destructive">
          <AlertDescription>
            服务器连接错误: {apiStatus.error}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              required
              disabled={loading}
              className={touched.email && getFieldError('email') ? "border-red-500" : ""}
            />
            {touched.email && getFieldError('email') && (
              <p className="text-sm text-red-500">{getFieldError('email')}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              required
              minLength={8}
              disabled={loading}
              className={touched.password && getFieldError('password') ? "border-red-500" : ""}
            />
            {touched.password && getFieldError('password') ? (
              <p className="text-sm text-red-500">{getFieldError('password')}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                密码长度至少为8个字符
              </p>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">名字</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => handleBlur('firstName')}
                required
                disabled={loading}
                className={touched.firstName && getFieldError('firstName') ? "border-red-500" : ""}
              />
              {touched.firstName && getFieldError('firstName') && (
                <p className="text-sm text-red-500">{getFieldError('firstName')}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">姓氏</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => handleBlur('lastName')}
                required
                disabled={loading}
                className={touched.lastName && getFieldError('lastName') ? "border-red-500" : ""}
              />
              {touched.lastName && getFieldError('lastName') && (
                <p className="text-sm text-red-500">{getFieldError('lastName')}</p>
              )}
            </div>
          </div>
          {(formError || authError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {formError || authError?.message}
              </AlertDescription>
            </Alert>
          )}
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            注册
          </Button>
        </div>
      </form>
    </div>
  )
} 