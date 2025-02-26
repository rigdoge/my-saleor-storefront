'use client'

import { useAuth } from "@/components/providers/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Package, Heart, Settings, CreditCard, User, ShoppingBag, Bell, LogOut, ChevronRight, Calendar, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function AccountPage() {
  const { user, logout } = useAuth()
  // Define orders with empty array as default value
  const [orders] = useState<any[]>([])
  const [greeting, setGreeting] = useState<string>("")

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("早上好")
    else if (hour < 18) setGreeting("下午好")
    else setGreeting("晚上好")
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <RequireAuth>
      <div className="container py-10 max-w-7xl mx-auto">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* User Profile Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 backdrop-blur-sm border border-primary/10 dark:border-primary/20">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-lg">
                <AvatarImage src={user?.avatar || ""} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0] || user?.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {greeting}，{user?.firstName || "尊敬的用户"}
                  </h1>
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                    VIP会员
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2 self-end md:self-auto mt-4 md:mt-0">
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  设置
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                退出
              </Button>
            </div>
          </motion.div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-4 md:w-[400px] h-12 p-1 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">概览</TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">订单</TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">收藏</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">资料</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-bl-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">待处理订单</CardTitle>
                      <Package className="h-5 w-5 text-primary/70" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground mt-1">近30天内</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-bl-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">收藏商品</CardTitle>
                      <Heart className="h-5 w-5 text-primary/70" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground mt-1">点击查看详情</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-bl-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">支付方式</CardTitle>
                      <CreditCard className="h-5 w-5 text-primary/70" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground mt-1">已绑定支付方式</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-bl-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">账户状态</CardTitle>
                      <User className="h-5 w-5 text-primary/70" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium flex items-center">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          已验证
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">账户安全状态良好</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Recent Activity & Account Info */}
              <div className="grid gap-6 md:grid-cols-7">
                <motion.div variants={itemVariants} className="md:col-span-4">
                  <Card className="border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>近期订单</CardTitle>
                        <Button variant="ghost" size="sm" asChild className="text-xs">
                          <Link href="/account/orders">
                            查看全部
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <CardDescription>
                        您最近的3笔订单
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!orders || orders.length === 0 ? (
                        <div className="py-8 text-center">
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <ShoppingBag className="h-6 w-6 text-primary/70" />
                          </div>
                          <p className="text-sm font-medium">暂无订单</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            您的订单将显示在这里
                          </p>
                          <Button variant="outline" size="sm" className="mt-4" asChild>
                            <Link href="/products">
                              浏览商品
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {/* Order list would go here */}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-3">
                  <Card className="border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200 h-full">
                    <CardHeader>
                      <CardTitle>账户信息</CardTitle>
                      <CardDescription>
                        您的个人信息
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm font-medium">姓名</p>
                        </div>
                        <p className="text-sm pl-6 text-muted-foreground">
                          {user?.firstName} {user?.lastName || '未设置'}
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm font-medium">通知设置</p>
                        </div>
                        <p className="text-sm pl-6 text-muted-foreground">
                          已开启邮件通知
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm font-medium">注册时间</p>
                        </div>
                        <p className="text-sm pl-6 text-muted-foreground">
                          2023年3月10日
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href="/account/settings">
                          编辑个人信息
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>

              {/* Activity Timeline */}
              <motion.div variants={itemVariants}>
                <Card className="border-primary/5 dark:border-primary/10 hover:shadow-md transition-all duration-200">
                  <CardHeader>
                    <CardTitle>近期活动</CardTitle>
                    <CardDescription>
                      您账户的最近活动记录
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="h-full w-px bg-border" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium">登录成功</p>
                          <p className="text-xs text-muted-foreground">
                            您在 {new Date().toLocaleDateString('zh-CN')} {new Date().toLocaleTimeString('zh-CN')} 成功登录
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium">账户创建</p>
                          <p className="text-xs text-muted-foreground">
                            您的账户于 2023年3月10日 创建
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>我的订单</CardTitle>
                  <CardDescription>
                    查看和管理您的所有订单
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <ShoppingBag className="h-6 w-6 text-primary/70" />
                    </div>
                    <p className="text-sm font-medium">暂无订单</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      您的订单将显示在这里
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href="/products">
                        浏览商品
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>我的收藏</CardTitle>
                  <CardDescription>
                    查看和管理您收藏的商品
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Heart className="h-6 w-6 text-primary/70" />
                    </div>
                    <p className="text-sm font-medium">暂无收藏</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      您收藏的商品将显示在这里
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href="/products">
                        浏览商品
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>
                    管理您的个人信息和偏好设置
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-32 w-32 border-2 border-primary/20 shadow-lg">
                          <AvatarImage src={user?.avatar || ""} alt={user?.firstName || "User"} />
                          <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                            {user?.firstName?.[0]}{user?.lastName?.[0] || user?.email?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          更换头像
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">名字</p>
                          <p className="text-sm p-2 rounded bg-muted/50 border border-border">
                            {user?.firstName || '未设置'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">姓氏</p>
                          <p className="text-sm p-2 rounded bg-muted/50 border border-border">
                            {user?.lastName || '未设置'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">电子邮箱</p>
                        <p className="text-sm p-2 rounded bg-muted/50 border border-border">
                          {user?.email}
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <Button>
                          更新个人资料
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </RequireAuth>
  )
} 