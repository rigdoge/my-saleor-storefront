import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取响应对象
  const response = NextResponse.next()
  
  // 设置CSP头，允许unsafe-eval
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )
  
  return response
}

// 配置中间件应用于所有路由
export const config = {
  matcher: '/:path*',
} 