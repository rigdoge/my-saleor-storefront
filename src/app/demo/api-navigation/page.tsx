import React from 'react';
import { ApiNavigation } from '@/components/layout/api-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ApiNavigationDemo() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Navigation Demo</h1>
        <p className="text-gray-600 mb-8">
          This page demonstrates how to use the Saleor API to fetch menu data for navigation components. You can configure your menus in the Saleor admin panel and display them in your frontend.
        </p>

        <Tabs defaultValue="demo">
          <TabsList className="mb-6">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>标准导航菜单</CardTitle>
                <CardDescription>
                  显示来自Saleor API的"main-menu"菜单
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border p-4 rounded-lg">
                  <ApiNavigation menuSlug="main-menu" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>如何使用</CardTitle>
                <CardDescription>
                  使用ApiNavigation组件的基本代码示例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
                  <pre>{`// 基本用法 - 使用默认菜单（main-menu）
<ApiNavigation />

// 使用特定的菜单
<ApiNavigation menuSlug="footer-menu" />

// 添加自定义类名
<ApiNavigation menuSlug="main-menu" className="my-custom-class" />

// 集成到头部导航
// src/components/layout/header.tsx
import { ApiNavigation } from "@/components/layout/api-navigation"

export function Header() {
  return (
    <header>
      <div className="container">
        <div className="logo">...</div>
        <ApiNavigation menuSlug="main-menu" />
        <div className="cart">...</div>
      </div>
    </header>
  )
}`}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>安装步骤</CardTitle>
                <CardDescription>
                  如何在你的项目中设置API导航组件
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. 安装依赖</h3>
                    <div className="bg-gray-900 p-4 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
                      <pre>{`npm install @radix-ui/react-navigation-menu class-variance-authority`}</pre>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      这将安装导航菜单组件所需的Radix UI导航菜单组件和class-variance-authority工具。
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">2. 创建依赖组件</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      确保创建了必要的UI组件：
                    </p>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>navigation-menu.tsx - Radix UI导航菜单组件</li>
                      <li>确保有可用的cn工具函数（通常在utils.ts中）</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">3. 配置环境变量</h3>
                    <p className="text-sm text-gray-600">
                      确保已正确设置了<code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_API_URI</code>环境变量，
                      指向你的Saleor GraphQL API端点。
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">4. 在Saleor管理面板中配置菜单</h3>
                    <p className="text-sm text-gray-600">
                      使用Saleor管理面板创建并配置你的菜单结构，设置适当的slug（如"main-menu"）。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="styles">
            <Card>
              <CardHeader>
                <CardTitle>不同菜单示例</CardTitle>
                <CardDescription>
                  展示不同菜单slug的效果
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">主导航菜单 (main-menu)</h3>
                  <div className="border p-4 rounded-lg">
                    <ApiNavigation menuSlug="main-menu" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">页脚导航菜单 (footer)</h3>
                  <div className="border p-4 rounded-lg">
                    <ApiNavigation menuSlug="footer" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">自定义菜单 (custom-menu)</h3>
                  <div className="border p-4 rounded-lg">
                    <ApiNavigation menuSlug="custom-menu" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="troubleshooting">
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>
                  Common issues and their solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Menu Not Found</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-yellow-700">
                      The most common issue is using an incorrect menu slug. In this store's Saleor instance, the main navigation menu uses the slug <code className="bg-white px-1 rounded">"navbar"</code> (not "main-menu").
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm">Check the following:</p>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>Verify the menu exists in your Saleor admin panel</li>
                      <li>Use <code className="bg-gray-100 px-1 rounded">menuSlug="navbar"</code> for the main navigation in this store</li>
                      <li>Check browser console for detailed API error messages</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Ensure your <code className="bg-gray-100 px-1 rounded">.env</code> file contains the correct API endpoint:
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
                    <pre>{`NEXT_PUBLIC_API_URI=https://api.saleor.tschenfeng.com/graphql/`}</pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Test API Connection</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    You can test your API connection with this curl command:
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
                    <pre>{`curl -X POST \\
  -H "Content-Type: application/json" \\
  --data '{"query": "query { menus(first: 3) { edges { node { id name slug } } } }"}' \\
  https://api.saleor.tschenfeng.com/graphql/`}</pre>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This should return a list of available menus in your Saleor instance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Known Menus</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    The following menus are available in this store's Saleor instance:
                  </p>
                  <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b py-2 px-4 text-left font-medium text-gray-500">Slug</th>
                        <th className="border-b py-2 px-4 text-left font-medium text-gray-500">Name</th>
                        <th className="border-b py-2 px-4 text-left font-medium text-gray-500">Usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-4 font-mono">navbar</td>
                        <td className="py-2 px-4">Navbar</td>
                        <td className="py-2 px-4">Main top navigation</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-mono">footer</td>
                        <td className="py-2 px-4">Footer</td>
                        <td className="py-2 px-4">Footer navigation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 