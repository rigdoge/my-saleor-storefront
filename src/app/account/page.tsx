'use client'

import { useAuth } from "@/components/providers/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Package, Heart, Settings, CreditCard } from "lucide-react"

export default function AccountPage() {
  const { user } = useAuth()

  return (
    <RequireAuth>
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">个人中心</h2>
            <p className="text-muted-foreground">
              管理您的账户信息和订单
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="orders">订单</TabsTrigger>
              <TabsTrigger value="favorites">收藏</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      待处理订单
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      收藏商品
                    </CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      支付方式
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      账户设置
                    </CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {user?.email}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>最近订单</CardTitle>
                    <CardDescription>
                      您最近的3个订单
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                      暂无订单
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>账户信息</CardTitle>
                    <CardDescription>
                      您的个人信息
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">邮箱</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">姓名</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/account/settings">
                        编辑信息
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuth>
  )
} 