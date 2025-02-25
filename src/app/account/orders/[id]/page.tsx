'use client'

import { useQuery } from "@tanstack/react-query"
import { RequireAuth } from "@/components/auth/require-auth"
import { ORDER_BY_ID_QUERY } from "@/lib/graphql/queries/orders"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

function OrderLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    </div>
  )
}

export default function OrderPage({
  params
}: {
  params: { id: string }
}) {
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => {
      const response = await graphqlRequestClient(ORDER_BY_ID_QUERY, {
        id: params.id
      })
      return response.order
    }
  })

  return (
    <RequireAuth>
      <div className="container py-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">返回</span>
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">订单详情</h2>
              <p className="text-muted-foreground">
                订单号：{order?.number}
              </p>
            </div>
          </div>

          {isLoading ? (
            <OrderLoading />
          ) : !order ? (
            <div className="text-center">
              <p className="text-lg font-medium">订单不存在</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>订单信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">订单状态</p>
                    <p className="text-sm text-muted-foreground">{order.status}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">下单时间</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">支付状态</p>
                    <p className="text-sm text-muted-foreground">{order.paymentStatus}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">支付方式</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod || '未指定'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">订单总额</p>
                    <p className="text-lg font-bold">
                      {formatPrice(order.total.gross.amount, {
                        currency: order.total.gross.currency
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {order.shippingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle>收货信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">收货人</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">联系电话</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.phone || '未提供'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">收货地址</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.streetAddress1}
                        {order.shippingAddress.streetAddress2 && ` ${order.shippingAddress.streetAddress2}`}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.countryArea}
                        <br />
                        {order.shippingAddress.postalCode}
                        <br />
                        {order.shippingAddress.country.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>商品信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {order.lines.map((line: any) => (
                      <div key={line.id} className="flex items-center gap-4 py-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-md">
                          <Image
                            src={line.thumbnail?.url || "/images/placeholder.jpg"}
                            alt={line.thumbnail?.alt || line.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{line.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            SKU: {line.productSku}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            数量: {line.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(line.unitPrice.gross.amount * line.quantity, {
                              currency: line.unitPrice.gross.currency
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(line.unitPrice.gross.amount, {
                              currency: line.unitPrice.gross.currency
                            })} / 件
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
} 