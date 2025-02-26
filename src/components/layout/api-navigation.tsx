'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { MAIN_MENU_QUERY, MENU_BY_SLUG_QUERY, NAVBAR_MENU_QUERY } from '@/lib/graphql/queries/menus';
import { request } from 'graphql-request';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';

// 定义类型
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
  } | null;
  collection?: {
    id: string;
    name: string;
    slug: string;
    backgroundImage?: {
      url: string;
      alt?: string | null;
    } | null;
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

interface ApiNavigationProps {
  menuSlug?: string;
  className?: string;
}

export function ApiNavigation({ menuSlug = 'navbar', className }: ApiNavigationProps) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 构建 fetchMenu 函数，并使其可以被重用
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = process.env.NEXT_PUBLIC_API_URI || '';
      
      // Choose the appropriate query based on menuSlug
      let query;
      let variables;
      
      if (menuSlug === 'navbar') {
        query = NAVBAR_MENU_QUERY;
        variables = undefined;
      } else if (menuSlug === 'main-menu') {
        query = MAIN_MENU_QUERY;
        variables = undefined;
      } else {
        query = MENU_BY_SLUG_QUERY;
        variables = { slug: menuSlug };
      }
      
      console.log('Fetching menu data from:', endpoint);
      console.log('Using menu slug:', menuSlug);
      
      if (!endpoint) {
        console.error('API endpoint is not configured');
        setError('API endpoint is not configured. Please check NEXT_PUBLIC_API_URI environment variable.');
        setLoading(false);
        return;
      }
      
      const data = await request<MenuResponse>(endpoint, query, variables);
      
      console.log('Response data:', data);
      
      if (data?.menu) {
        setMenu(data.menu);
      } else {
        setError('Menu data not found');
      }
    } catch (err: any) {
      console.error('Error fetching menu:', err);
      let errorMessage = 'Failed to load menu data';
      
      // Add more detailed error information
      if (err.response?.errors) {
        errorMessage += ': ' + err.response.errors.map((e: any) => e.message).join(', ');
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 获取菜单数据
  useEffect(() => {
    fetchMenu();
  }, [menuSlug]);

  // 帮助函数：获取链接URL
  const getItemUrl = (item: MenuItem): string => {
    if (item.url) return item.url;
    if (item.category) return `/categories/${item.category.slug}`;
    if (item.collection) return `/collections/${item.collection.slug}`;
    if (item.page) return `/pages/${item.page.slug}`;
    return '#';
  };

  // 获取子菜单项目数量
  const getChildrenCount = (item: MenuItem): number => {
    return item.children?.length || 0;
  };

  // 加载状态组件
  if (loading) {
    return (
      <div className={cn("flex space-x-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  // 错误状态组件
  if (error) {
    return (
      <div className={cn("text-red-500", className)}>
        <p>Menu loading error: {error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => fetchMenu()}
        >
          Retry
        </Button>
        <div className="text-xs text-gray-500 mt-2">
          <p>Debug info:</p>
          <ul className="list-disc pl-5">
            <li>API endpoint: {process.env.NEXT_PUBLIC_API_URI || 'Not configured'}</li>
            <li>Menu slug: {menuSlug}</li>
          </ul>
        </div>
      </div>
    );
  }

  // 如果没有找到菜单或菜单项
  if (!menu || menu.items.length === 0) {
    return (
      <div className={cn("text-gray-500", className)}>
        <p>No menu items found for: {menuSlug}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => fetchMenu()}
        >
          Retry
        </Button>
        <div className="text-xs text-gray-500 mt-2">
          <p>Troubleshooting:</p>
          <ul className="list-disc pl-5">
            <li>Check if the menu with slug "{menuSlug}" exists in Saleor admin panel</li>
            <li>Verify API endpoint configuration</li>
          </ul>
        </div>
      </div>
    );
  }

  // 主导航菜单组件
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {menu.items.map((item) => {
          const hasChildren = getChildrenCount(item) > 0;
          
          return hasChildren ? (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuTrigger className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                {item.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                  {item.children?.map((child) => (
                    <li key={child.id} className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href={getItemUrl(child)}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {child.name}
                          </div>
                          {child.children && child.children.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              <ul className="space-y-1 mt-2">
                                {child.children.map((grandChild) => (
                                  <li key={grandChild.id}>
                                    <Link 
                                      href={getItemUrl(grandChild)} 
                                      className="hover:underline text-xs"
                                    >
                                      {grandChild.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.id}>
              <Link href={getItemUrl(item)} legacyBehavior passHref>
                <NavigationMenuLink className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                  {item.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
} 