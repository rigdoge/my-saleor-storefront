'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Grid, Layers, Layout, ShoppingBag, FileText, Globe } from 'lucide-react';
import { MAIN_MENU_QUERY, MENU_BY_SLUG_QUERY } from '@/lib/graphql/queries/menus';
import { request } from 'graphql-request';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Define types for menu data
type MenuItem = {
  id: string;
  name: string;
  url?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    backgroundImage?: {
      url: string;
      alt?: string | null;
    } | null;
    products?: {
      totalCount: number;
    };
  } | null;
  collection?: {
    id: string;
    name: string;
    slug: string;
    backgroundImage?: {
      url: string;
      alt?: string | null;
    } | null;
    products?: {
      totalCount: number;
    };
  } | null;
  page?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  children?: MenuItem[] | null;
};

type Menu = {
  id: string;
  name: string;
  slug: string;
  items: MenuItem[];
};

// 定义GraphQL响应类型
type MenuResponse = {
  menu: Menu;
};

type ApiMegaMenuProps = {
  menuSlug?: string;
  style?: 'modern' | 'grid' | 'sidebar';
};

export function ApiMegaMenu({ menuSlug = 'navbar', style = 'modern' }: ApiMegaMenuProps) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [activeStyle, setActiveStyle] = useState<'modern' | 'grid' | 'sidebar'>(style);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // 提取fetchMenu函数到组件顶层
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      const endpoint = process.env.NEXT_PUBLIC_API_URI || 'https://api.example.com/graphql/';
      const query = menuSlug === 'main-menu' ? MAIN_MENU_QUERY : MENU_BY_SLUG_QUERY;
      const variables = menuSlug !== 'main-menu' ? { slug: menuSlug } : undefined;
      
      console.log('Fetching menu data from:', endpoint);
      console.log('Using menu slug:', menuSlug);
      console.log('GraphQL query:', query);
      console.log('Query variables:', variables);
      
      const queryStartTime = Date.now();
      const data = await request<MenuResponse>(endpoint, query, variables);
      const queryTimeMs = Date.now() - queryStartTime;
      
      console.log(`Query completed in ${queryTimeMs}ms`);
      console.log('Response data:', data);
      
      // 保存调试信息
      setDebugInfo({
        endpoint,
        menuSlug,
        queryTimeMs,
        hasMenuData: !!data?.menu,
        itemsCount: data?.menu?.items?.length || 0,
        responseData: data
      });
      
      if (data?.menu) {
        setMenu(data.menu);
      } else {
        setError('Menu not found in API response. Please check if the menu slug is correct.');
      }
    } catch (err: any) {
      console.error('Error fetching menu:', err);
      
      // 捕获并提取更详细的错误信息
      let errorMessage = 'Failed to load menu data';
      let networkDetails = '';
      let graphqlErrors = [];
      
      // 网络错误
      if (err.response === undefined) {
        networkDetails = `Network error: ${err.message}`;
        errorMessage = `Network error: ${err.message}`;
      }
      
      // GraphQL错误
      if (err.response?.errors) {
        graphqlErrors = err.response.errors;
        errorMessage = err.response.errors.map((e: any) => e.message).join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`${errorMessage}`);
      
      // 保存调试信息
      setDebugInfo({
        endpoint: process.env.NEXT_PUBLIC_API_URI,
        menuSlug,
        error: err.message,
        networkDetails,
        graphqlErrors,
        statusCode: err.response?.status,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [menuSlug]);

  // Helper to get the link URL based on the menu item type
  const getItemUrl = (item: MenuItem): string => {
    if (item.url) return item.url;
    if (item.category) return `/categories/${item.category.slug}`;
    if (item.collection) return `/collections/${item.collection.slug}`;
    if (item.page) return `/pages/${item.page.slug}`;
    return '#';
  };

  // Helper to get the image URL for a menu item
  const getItemImage = (item: MenuItem): { url: string; alt: string } | null => {
    if (item.category?.backgroundImage) {
      return {
        url: item.category.backgroundImage.url,
        alt: item.category.backgroundImage.alt || item.category.name
      };
    }
    if (item.collection?.backgroundImage) {
      return {
        url: item.collection.backgroundImage.url,
        alt: item.collection.backgroundImage.alt || item.collection.name
      };
    }
    return null;
  };

  // Helper to get icon based on item type
  const getItemIcon = (item: MenuItem) => {
    if (item.category) return <ShoppingBag className="w-4 h-4 mr-2" />;
    if (item.page) return <FileText className="w-4 h-4 mr-2" />;
    if (item.collection) return <Grid className="w-4 h-4 mr-2" />;
    return <Globe className="w-4 h-4 mr-2" />;
  };

  // Helper to get product count for an item
  const getProductCount = (item: MenuItem): number => {
    if (item.category?.products) return item.category.products.totalCount;
    if (item.collection?.products) return item.collection.products.totalCount;
    return 0;
  };

  // Style Switcher Component
  const StyleSwitcher = () => (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium">样式:</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center text-sm font-medium px-3 py-1 rounded-md border bg-background hover:bg-accent">
          {activeStyle === 'modern' && <Layout className="w-4 h-4 mr-2" />}
          {activeStyle === 'grid' && <Grid className="w-4 h-4 mr-2" />}
          {activeStyle === 'sidebar' && <Layers className="w-4 h-4 mr-2" />}
          {activeStyle.charAt(0).toUpperCase() + activeStyle.slice(1)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setActiveStyle('modern')}>
            <Layout className="w-4 h-4 mr-2" />
            Modern
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveStyle('grid')}>
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveStyle('sidebar')}>
            <Layers className="w-4 h-4 mr-2" />
            Sidebar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // 错误显示组件，包含详细的调试信息
  const ErrorDisplay = () => (
    <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
      <h3 className="font-medium mb-2">Menu Loading Error</h3>
      <p className="text-sm">{error}</p>
      <div className="mt-2 text-xs">
        <p>Please check:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Ensure your Saleor API is accessible: <code className="bg-white px-1 rounded">{process.env.NEXT_PUBLIC_API_URI}</code></li>
          <li>Verify that menu slug <code className="bg-white px-1 rounded">{menuSlug}</code> exists in Saleor admin panel</li>
          <li>Check if the API URL is correctly set in environment variables</li>
          <li>Check browser console for more detailed error information</li>
        </ul>
        
        {debugInfo && (
          <div className="mt-3 p-2 bg-white border border-red-100 rounded overflow-auto max-h-64">
            <p className="font-medium mb-1">Debug information:</p>
            <div className="text-xs font-mono">
              <p>Endpoint: {debugInfo.endpoint}</p>
              <p>Menu Slug: {debugInfo.menuSlug}</p>
              {debugInfo.statusCode && <p>Status code: {debugInfo.statusCode}</p>}
              {debugInfo.networkDetails && <p>Network: {debugInfo.networkDetails}</p>}
              {debugInfo.graphqlErrors && debugInfo.graphqlErrors.length > 0 && (
                <div className="mt-1">
                  <p>GraphQL errors:</p>
                  <ul className="list-disc pl-5">
                    {debugInfo.graphqlErrors.map((err: any, i: number) => (
                      <li key={i} className="break-all">{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 显示GraphQL验证信息 */}
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <p className="font-medium">GraphQL query tips:</p>
                <p>If you see errors related to the "channel" parameter, this indicates your Saleor version might be incompatible with the query.</p>
                <p className="mt-1">Ensure your GraphQL queries are compatible with your Saleor API schema.</p>
              </div>
            </div>
          </div>
        )}
        
        <button 
          className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-red-800 transition-colors"
          onClick={() => fetchMenu()}
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Modern Style Mega Menu
  const ModernMegaMenu = () => (
    <div className="container mx-auto">
      {process.env.NODE_ENV === 'development' && (
        <>
          <StyleSwitcher />
          {debugInfo && !error && (
            <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded text-xs">
              <p className="font-medium text-blue-800">Debug Info</p>
              <p>API: {debugInfo.endpoint}</p>
              <p>Menu: {debugInfo.menuSlug} (found {debugInfo.itemsCount} items)</p>
              <p>Query time: {debugInfo.queryTimeMs}ms</p>
            </div>
          )}
        </>
      )}
      <nav className="flex space-x-8 border-b pb-1">
        {loading ? (
          <div className="flex space-x-8">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="h-10 w-24 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : error ? (
          <ErrorDisplay />
        ) : menu && menu.items.length > 0 ? (
          menu.items.map((item) => (
            <Popover key={item.id}>
              <PopoverTrigger className="group flex items-center py-3 text-base font-medium transition-colors hover:text-primary">
                {item.name}
                {item.children && item.children.length > 0 && (
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                )}
              </PopoverTrigger>
              {item.children && item.children.length > 0 && (
                <PopoverContent className="w-[600px] p-0" align="start">
                  <Card className="border-0 shadow-none">
                    <CardContent className="grid grid-cols-12 gap-4 p-6">
                      <div className="col-span-8">
                        <div className="grid grid-cols-2 gap-4">
                          {item.children.map((child) => (
                            <div key={child.id} className="space-y-3">
                              <Link 
                                href={getItemUrl(child)}
                                className="text-sm font-medium hover:text-primary hover:underline flex items-center"
                              >
                                {getItemIcon(child)}
                                {child.name}
                              </Link>
                              
                              {/* 子项目 */}
                              {child.children && child.children.length > 0 && (
                                <ul className="space-y-1">
                                  {child.children.map((grandchild) => (
                                    <li key={grandchild.id}>
                                      <Link 
                                        href={getItemUrl(grandchild)}
                                        className="text-xs text-muted-foreground hover:text-primary hover:underline"
                                      >
                                        {grandchild.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="col-span-4">
                        {item.category?.backgroundImage?.url ? (
                          <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image 
                              src={item.category.backgroundImage.url}
                              alt={item.category.backgroundImage.alt || item.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                              <div className="text-white">
                                <h4 className="font-medium">{item.name}</h4>
                                <Link 
                                  href={getItemUrl(item)}
                                  className="text-xs opacity-90 hover:opacity-100 hover:underline"
                                >
                                  Browse All
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : item.collection?.backgroundImage?.url ? (
                          <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image 
                              src={item.collection.backgroundImage.url}
                              alt={item.collection.backgroundImage.alt || item.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                              <div className="text-white">
                                <h4 className="font-medium">{item.name}</h4>
                                <Link 
                                  href={getItemUrl(item)}
                                  className="text-xs opacity-90 hover:opacity-100 hover:underline"
                                >
                                  Browse All
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center p-4">
                              <span className="text-muted-foreground block mb-2">{item.name}</span>
                              <Link 
                                href={getItemUrl(item)}
                                className="text-xs font-medium text-primary hover:underline"
                              >
                                Browse All
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </PopoverContent>
              )}
            </Popover>
          ))
        ) : (
          <div className="py-3 text-muted-foreground">No menu items found for: "{menuSlug}"</div>
        )}
      </nav>
    </div>
  );

  // Grid Style Mega Menu
  const GridMegaMenu = () => (
    <div className="container mx-auto">
      {process.env.NODE_ENV === 'development' && (
        <>
          <StyleSwitcher />
          {debugInfo && !error && (
            <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded text-xs">
              <p className="font-medium text-blue-800">Debug Info</p>
              <p>API: {debugInfo.endpoint}</p>
              <p>Menu: {debugInfo.menuSlug} (found {debugInfo.itemsCount} items)</p>
              <p>Query time: {debugInfo.queryTimeMs}ms</p>
            </div>
          )}
        </>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorDisplay />
      ) : menu && menu.items.length > 0 ? (
        <div className="py-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {menu.items.slice(0, 6).map((item) => (
                <TabsTrigger key={item.id} value={item.id}>{item.name}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {menu.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-all">
                    <div className="aspect-[4/3] relative bg-muted">
                      {(item.category?.backgroundImage?.url || item.collection?.backgroundImage?.url) && (
                        <Image 
                          src={item.category?.backgroundImage?.url || item.collection?.backgroundImage?.url || ''}
                          alt={item.category?.backgroundImage?.alt || item.collection?.backgroundImage?.alt || item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="text-white font-medium text-lg">{item.name}</h3>
                          {item.children && (
                            <p className="text-white/80 text-xs mt-1">
                              {item.children.length} 子类别
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {item.children && item.children.length > 0 && (
                        <ul className="space-y-1 text-sm">
                          {item.children.slice(0, 5).map((child) => (
                            <li key={child.id}>
                              <Link 
                                href={getItemUrl(child)}
                                className="text-muted-foreground hover:text-primary hover:underline"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                          {item.children.length > 5 && (
                            <li>
                              <Link 
                                href={getItemUrl(item)}
                                className="text-primary text-xs font-medium hover:underline"
                              >
                                查看全部 {item.children.length} 个项目
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {menu.items.slice(0, 6).map((item) => (
              <TabsContent key={item.id} value={item.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {item.children && item.children.map((child) => (
                    <Card key={child.id} className="overflow-hidden group hover:shadow-md transition-all">
                      <div className="aspect-video relative bg-muted">
                        {(child.category?.backgroundImage?.url || child.collection?.backgroundImage?.url) && (
                          <Image 
                            src={child.category?.backgroundImage?.url || child.collection?.backgroundImage?.url || ''}
                            alt={child.category?.backgroundImage?.alt || child.collection?.backgroundImage?.alt || child.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <h3 className="text-white font-medium">{child.name}</h3>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        {child.children && child.children.length > 0 && (
                          <ul className="space-y-1 text-sm">
                            {child.children.slice(0, 4).map((grandchild) => (
                              <li key={grandchild.id}>
                                <Link 
                                  href={getItemUrl(grandchild)}
                                  className="text-muted-foreground hover:text-primary hover:underline"
                                >
                                  {grandchild.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="py-6 text-center text-muted-foreground">
          没有找到菜单项: "{menuSlug}"
        </div>
      )}
    </div>
  );

  // Sidebar Style Mega Menu
  const SidebarMegaMenu = () => (
    <div className="container mx-auto">
      {process.env.NODE_ENV === 'development' && (
        <>
          <StyleSwitcher />
          {debugInfo && !error && (
            <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded text-xs">
              <p className="font-medium text-blue-800">调试信息</p>
              <p>API: {debugInfo.endpoint}</p>
              <p>菜单: {debugInfo.menuSlug} (找到 {debugInfo.itemsCount} 个项目)</p>
              <p>查询用时: {debugInfo.queryTimeMs}ms</p>
            </div>
          )}
        </>
      )}
      
      {loading ? (
        <div className="grid grid-cols-12 gap-8 py-6">
          <div className="col-span-3">
            <div className="h-[70vh] bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="col-span-9">
            <div className="h-[70vh] bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      ) : error ? (
        <ErrorDisplay />
      ) : menu && menu.items.length > 0 ? (
        <div className="grid grid-cols-12 gap-8 py-6">
          <div className="col-span-3 border-r pr-4">
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-1">
                {menu.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="font-medium py-1">{item.name}</div>
                    {item.children && item.children.length > 0 && (
                      <ul className="pl-4 space-y-1 pt-1">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link 
                              href={getItemUrl(child)}
                              className="text-sm text-muted-foreground hover:text-primary block py-1 hover:underline"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="col-span-9">
            <div className="grid grid-cols-3 gap-6">
              {menu.items.slice(0, 3).map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                    {(item.category?.backgroundImage?.url || item.collection?.backgroundImage?.url) && (
                      <Image 
                        src={item.category?.backgroundImage?.url || item.collection?.backgroundImage?.url || ''}
                        alt={item.category?.backgroundImage?.alt || item.collection?.backgroundImage?.alt || item.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <Link 
                          href={getItemUrl(item)}
                          className="text-xs text-white/90 hover:text-white hover:underline"
                        >
                          查看全部
                        </Link>
                      </div>
                    </div>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {item.children.slice(0, 4).map((child) => (
                        <Link 
                          key={child.id}
                          href={getItemUrl(child)}
                          className="text-sm border rounded-md p-2 hover:bg-muted flex items-center transition-colors"
                        >
                          {getItemIcon(child)}
                          <span className="truncate">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-4">特色产品</h3>
              <div className="grid grid-cols-4 gap-4">
                {menu.items.slice(0, 4).map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative bg-muted">
                      {(item.category?.backgroundImage?.url || item.collection?.backgroundImage?.url) && (
                        <Image 
                          src={item.category?.backgroundImage?.url || item.collection?.backgroundImage?.url || ''}
                          alt={item.category?.backgroundImage?.alt || item.collection?.backgroundImage?.alt || item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-3">
                      <Link 
                        href={getItemUrl(item)}
                        className="text-sm font-medium hover:underline line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">{item.children?.length || 0} 子项目</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-muted-foreground">
          没有找到菜单项: "{menuSlug}"
        </div>
      )}
    </div>
  );

  return (
    <div className="py-4">
      {activeStyle === 'modern' && <ModernMegaMenu />}
      {activeStyle === 'grid' && <GridMegaMenu />}
      {activeStyle === 'sidebar' && <SidebarMegaMenu />}
    </div>
  );
} 