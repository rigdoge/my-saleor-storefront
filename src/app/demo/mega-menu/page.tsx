'use client';

import React, { useState } from 'react';
import { ApiMegaMenu } from '@/components/layout/api-mega-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronDown, Grid, Layers, Layout, Menu as MenuIcon } from 'lucide-react';

export default function MegaMenuDemo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState<'modern' | 'grid' | 'sidebar' | 'fullpage'>('fullpage');
  const [activeMenuSlug, setActiveMenuSlug] = useState('navbar');

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mega Menu 演示</h1>
        <p className="text-gray-600 mb-8">
          本页面展示了如何使用全页面导航菜单组件，自动加载类别图片，并提供不同的样式选项。
        </p>

        <Tabs defaultValue="demo">
          <TabsList className="mb-6">
            <TabsTrigger value="demo">演示</TabsTrigger>
            <TabsTrigger value="usage">使用方法</TabsTrigger>
            <TabsTrigger value="styles">样式选项</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>全页面导航菜单</CardTitle>
                <CardDescription>
                  点击下方按钮打开全页面导航菜单，自动加载类别图片。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="border p-6 rounded-lg flex flex-col items-center justify-center">
                    <Button 
                      size="lg"
                      className="flex items-center"
                      onClick={() => setIsMenuOpen(true)}
                    >
                      <MenuIcon className="w-5 h-5 mr-2" />
                      打开全页面导航菜单
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      点击按钮将打开与移动端相同的全页面导航菜单
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">菜单样式</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant={activeStyle === 'fullpage' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveStyle('fullpage')}
                          className="flex items-center"
                        >
                          <Layout className="w-4 h-4 mr-2" />
                          全页面
                        </Button>
                        <Button 
                          variant={activeStyle === 'modern' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveStyle('modern')}
                          className="flex items-center"
                        >
                          <Layout className="w-4 h-4 mr-2" />
                          现代
                        </Button>
                        <Button 
                          variant={activeStyle === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveStyle('grid')}
                          className="flex items-center"
                        >
                          <Grid className="w-4 h-4 mr-2" />
                          网格
                        </Button>
                        <Button 
                          variant={activeStyle === 'sidebar' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveStyle('sidebar')}
                          className="flex items-center"
                        >
                          <Layers className="w-4 h-4 mr-2" />
                          侧边栏
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">菜单数据来源</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant={activeMenuSlug === 'navbar' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveMenuSlug('navbar')}
                        >
                          导航菜单 (navbar)
                        </Button>
                        <Button 
                          variant={activeMenuSlug === 'footer' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveMenuSlug('footer')}
                        >
                          页脚菜单 (footer)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>如何使用</CardTitle>
                <CardDescription>
                  在项目中使用全页面导航菜单的代码示例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
                  <pre>{`// 在你的组件中添加状态管理
import { useState } from 'react';
import { ApiMegaMenu } from '@/components/layout/api-mega-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  
  return (
    <>
      <header>
        {/* 添加一个按钮来触发菜单 */}
        <Button 
          variant="ghost" 
          onClick={() => setIsMegaMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span>菜单</span>
        </Button>
        
        {/* 其他头部组件内容 */}
      </header>
      
      {/* 添加全页面菜单组件 */}
      <ApiMegaMenu 
        menuSlug="navbar"
        style="fullpage"
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />
    </>
  );
}`}</pre>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">组件属性</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded min-w-28">menuSlug</span>
                      <span className="ml-4 text-sm">从Saleor API获取的菜单标识，例如 "navbar" 或 "footer"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded min-w-28">style</span>
                      <span className="ml-4 text-sm">菜单样式: "fullpage", "modern", "grid", 或 "sidebar"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded min-w-28">isOpen</span>
                      <span className="ml-4 text-sm">控制菜单是否显示的布尔值（仅适用于fullpage风格）</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded min-w-28">onClose</span>
                      <span className="ml-4 text-sm">关闭菜单时的回调函数（仅适用于fullpage风格）</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="styles">
            <Card>
              <CardHeader>
                <CardTitle>样式选项</CardTitle>
                <CardDescription>
                  MegaMenu 组件支持多种布局样式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">全页面样式 (fullpage)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    全屏显示菜单内容，主要用于移动设备或特殊场景。自动加载类别图片，支持类别详情和子类别导航。
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="aspect-video bg-gray-200 rounded-lg relative flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">演示不可用 - 请使用上方的演示按钮</p>
                        <Button 
                          size="sm" 
                          className="mt-3"
                          onClick={() => {
                            setActiveStyle('fullpage');
                            setIsMenuOpen(true);
                          }}
                        >
                          打开全页面菜单
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">现代样式 (modern)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    使用下拉式导航，适合常规网站头部导航。
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="aspect-video bg-gray-200 rounded-lg relative flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">演示不可用 - 请使用上方的演示按钮</p>
                        <Button 
                          size="sm" 
                          className="mt-3"
                          onClick={() => {
                            setActiveStyle('modern');
                            setIsMenuOpen(true);
                          }}
                        >
                          打开现代风格菜单
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">网格样式 (grid)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    卡片式网格布局，适合展示多个类别和促销内容。
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="aspect-video bg-gray-200 rounded-lg relative flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">演示不可用 - 请使用上方的演示按钮</p>
                        <Button 
                          size="sm" 
                          className="mt-3"
                          onClick={() => {
                            setActiveStyle('grid');
                            setIsMenuOpen(true);
                          }}
                        >
                          打开网格风格菜单
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">侧边栏样式 (sidebar)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    左侧导航 + 右侧内容的混合布局，适合复杂层级的导航结构。
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="aspect-video bg-gray-200 rounded-lg relative flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">演示不可用 - 请使用上方的演示按钮</p>
                        <Button 
                          size="sm" 
                          className="mt-3"
                          onClick={() => {
                            setActiveStyle('sidebar');
                            setIsMenuOpen(true);
                          }}
                        >
                          打开侧边栏风格菜单
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ApiMegaMenu 
        menuSlug={activeMenuSlug}
        style={activeStyle}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
} 