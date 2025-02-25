'use client'

import { useQuery } from "@tanstack/react-query"
import { RequireAuth } from "@/components/auth/require-auth"
import { USER_ORDERS_QUERY } from "@/lib/graphql/queries/orders"
import { graphqlRequestClient } from "@/lib/graphql/client"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"

function OrdersLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <p className="mb-4 text-lg font-medium">暂无订单</p>
      <Button asChild>
        <Link href="/products">去购物</Link>
      </Button>
    </div>
  )
}

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const response = await graphqlRequestClient(USER_ORDERS_QUERY, {
        first: 10
      })
      return response.me.orders.edges.map((edge: any) => edge.node)
    }
  })

  return (
    <RequireAuth>
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">我的订单</h2>
            <p className="text-muted-foreground">
              查看您的订单历史记录
            </p>
          </div>

          {isLoading ? (
            <OrdersLoading />
          ) : !ordersData || ordersData.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单号</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead className="text-right">总金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="font-medium hover:underline"
                        >
                          {order.number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.lines.map((line: any) => (
                            <div
                              key={line.id}
                              className="relative h-10 w-10 overflow-hidden rounded-md"
                            >
                              <Image
                                src={line.thumbnail?.url || "/images/placeholder.jpg"}
                                alt={line.thumbnail?.alt || line.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(order.total.gross.amount, {
                          currency: order.total.gross.currency
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
} 