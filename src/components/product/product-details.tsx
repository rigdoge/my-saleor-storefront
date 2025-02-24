'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Truck, ShieldCheck, ArrowLeftRight, Clock } from 'lucide-react'

interface ProductAttribute {
  attribute: {
    name: string
    slug: string
  }
  values: Array<{
    name: string
    slug: string
  }>
}

interface ProductDetails {
  description: string
  attributes: ProductAttribute[]
  metadata: Array<{
    key: string
    value: string
  }>
  category: {
    name: string
    ancestors?: {
      edges: Array<{
        node: {
          name: string
          slug: string
        }
      }>
    }
  }
}

interface ProductDetailsProps {
  details: ProductDetails
}

function parseDescription(description: string) {
  try {
    const data = JSON.parse(description)
    if (data.blocks) {
      return data.blocks.map((block: any) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <div 
                key={block.id} 
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            )
          default:
            return null
        }
      })
    }
  } catch (error) {
    // 如果解析失败，直接返回原始文本
    return <p>{description}</p>
  }
}

export function ProductDetails({ details }: ProductDetailsProps) {
  const categoryPath = details.category.ancestors?.edges.map(edge => edge.node.name).concat(details.category.name) || [details.category.name]

  return (
    <div className="space-y-6">
      {/* 服务保障 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border p-4">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">快速配送</p>
            <p className="text-xs text-muted-foreground">48小时内发货</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-4">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">正品保证</p>
            <p className="text-xs text-muted-foreground">官方授权销售</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-4">
          <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">无忧退换</p>
            <p className="text-xs text-muted-foreground">7天无理由退换</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">极速发货</p>
            <p className="text-xs text-muted-foreground">当天完成发货</p>
          </div>
        </div>
      </div>

      {/* 商品分类 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>分类：</span>
        {categoryPath.map((name, index) => (
          <React.Fragment key={name}>
            {index > 0 && <span className="mx-1">/</span>}
            <span>{name}</span>
          </React.Fragment>
        ))}
      </div>

      <Separator />

      {/* 详细信息标签页 */}
      <Tabs defaultValue="description" className="space-y-4">
        <TabsList>
          <TabsTrigger value="description">商品介绍</TabsTrigger>
          <TabsTrigger value="specification">规格参数</TabsTrigger>
          <TabsTrigger value="service">售后服务</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          {parseDescription(details.description)}
        </TabsContent>

        <TabsContent value="specification" className="space-y-4">
          {details.attributes.map(attr => (
            <div key={attr.attribute.slug} className="flex border-b py-2">
              <span className="w-32 flex-shrink-0 text-muted-foreground">
                {attr.attribute.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {attr.values.map(value => (
                  <Badge key={value.slug} variant="secondary">
                    {value.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {details.metadata.map(meta => (
            <div key={meta.key} className="flex border-b py-2">
              <span className="w-32 flex-shrink-0 text-muted-foreground">
                {meta.key}
              </span>
              <span>{meta.value}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">退换货政策</h3>
            <p className="mt-2 text-muted-foreground">
              本商品支持7天无理由退换货，在商品签收之日起7天内可发起退换货申请。
            </p>
            <h4 className="mt-4 font-medium">退换货条件</h4>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>商品及包装保持原状，不影响二次销售</li>
              <li>未经使用、洗涤、标签完整</li>
              <li>配件、赠品等齐全</li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">保修政策</h3>
            <p className="mt-2 text-muted-foreground">
              本商品提供正品保证，如有质量问题，请在签收后48小时内联系客服。
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 