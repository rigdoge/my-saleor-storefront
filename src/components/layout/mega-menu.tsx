'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Grid, Layers, Layout } from 'lucide-react';
import { CATEGORIES_QUERY } from '@/lib/graphql/queries/categories';
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
import { Button } from '@/components/ui/button';

// Define types for category data
type CategoryImage = {
  url: string;
  alt: string;
};

type SubCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  backgroundImage: CategoryImage | null;
  products: {
    totalCount: number;
  };
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  backgroundImage: CategoryImage | null;
  children: {
    edges: {
      node: SubCategory;
    }[];
    totalCount: number;
  };
  products: {
    totalCount: number;
  };
};

type CategoriesData = {
  categories: {
    edges: {
      node: Category;
    }[];
    totalCount: number;
  };
};

type MegaMenuProps = {
  style: 'modern' | 'grid' | 'sidebar';
};

export function MegaMenu({ style = 'modern' }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeStyle, setActiveStyle] = useState<'modern' | 'grid' | 'sidebar'>(style);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const endpoint = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com/graphql/';
        const data: CategoriesData = await request(endpoint, CATEGORIES_QUERY, {
          first: 20,
          channel: 'default-channel'
        });
        
        const fetchedCategories = data.categories.edges.map(edge => edge.node);
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Style Switcher Component
  const StyleSwitcher = () => (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium">Style:</span>
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

  // Modern Style Mega Menu
  const ModernMegaMenu = () => (
    <div className="container mx-auto">
      <StyleSwitcher />
      <nav className="flex space-x-8 border-b pb-1">
        {loading ? (
          <div className="flex space-x-8">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="h-10 w-24 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          categories.map((category) => (
            <Popover key={category.id}>
              <PopoverTrigger className="group flex items-center py-3 text-base font-medium transition-colors hover:text-primary">
                {category.name}
                <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="start">
                <Card className="border-0 shadow-none">
                  <CardContent className="grid grid-cols-12 gap-4 p-4">
                    <div className="col-span-8">
                      <div className="grid grid-cols-2 gap-4">
                        {category.children.edges.length > 0 ? (
                          category.children.edges.slice(0, 10).map(({ node }) => (
                            <div key={node.id}>
                              <Link 
                                href={`/categories/${node.slug}`}
                                className="text-sm font-medium hover:text-primary hover:underline"
                              >
                                {node.name}
                              </Link>
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                {node.products.totalCount} products
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">No subcategories available</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link 
                          href={`/categories/${category.slug}`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View all {category.products.totalCount} products
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <Link href={`/categories/${category.slug}`} className="block">
                        {category.backgroundImage?.url ? (
                          <div className="aspect-square relative overflow-hidden rounded-lg">
                            <Image
                              src={category.backgroundImage.url}
                              alt={category.backgroundImage.alt || category.name}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                            <span className="text-muted-foreground">{category.name}</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          ))
        )}
      </nav>
    </div>
  );

  // Grid Style Mega Menu
  const GridMegaMenu = () => (
    <div className="container mx-auto">
      <StyleSwitcher />
      <Tabs defaultValue={categories.length > 0 ? categories[0].id : undefined} className="w-full">
        <TabsList className="flex w-full h-auto justify-start mb-2 bg-transparent space-x-2">
          {loading ? (
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="h-10 w-28 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md"
              >
                {category.name}
              </TabsTrigger>
            ))
          )}
        </TabsList>
        {!loading && 
          categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-4 gap-6">
                    {category.children.edges.length > 0 ? (
                      category.children.edges.map(({ node }) => (
                        <Link 
                          key={node.id} 
                          href={`/categories/${node.slug}`}
                          className="group"
                        >
                          <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                            {node.backgroundImage?.url ? (
                              <Image
                                src={node.backgroundImage.url}
                                alt={node.backgroundImage.alt || node.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
                                <span className="text-muted-foreground">{node.name}</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {node.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {node.products.totalCount} products
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-8">
                        <p className="text-muted-foreground">No subcategories available</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button asChild>
                      <Link href={`/categories/${category.slug}`}>
                        View all {category.products.totalCount} products
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))
        }
      </Tabs>
    </div>
  );

  // Sidebar Style Mega Menu
  const SidebarMegaMenu = () => (
    <div className="container mx-auto">
      <StyleSwitcher />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3 border-r pr-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="h-10 w-full bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex flex-col">
                    <Link 
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    >
                      {category.name}
                      <span className="text-xs text-muted-foreground">
                        ({category.products.totalCount})
                      </span>
                    </Link>
                    {category.children.edges.length > 0 && (
                      <div className="ml-4 border-l pl-2 mt-1">
                        {category.children.edges.slice(0, 5).map(({ node }) => (
                          <Link 
                            key={node.id} 
                            href={`/categories/${node.slug}`}
                            className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs hover:bg-accent"
                          >
                            {node.name}
                            <span className="text-xs text-muted-foreground">
                              ({node.products.totalCount})
                            </span>
                          </Link>
                        ))}
                        {category.children.edges.length > 5 && (
                          <Link 
                            href={`/categories/${category.slug}`}
                            className="flex items-center px-3 py-1.5 text-xs text-primary hover:underline"
                          >
                            + {category.children.edges.length - 5} more
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="aspect-video bg-muted animate-pulse rounded-lg" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <Link 
                  key={category.id} 
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
                    {category.backgroundImage?.url ? (
                      <Image
                        src={category.backgroundImage.url}
                        alt={category.backgroundImage.alt || category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
                        <span className="text-muted-foreground">{category.name}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.products.totalCount} products
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center py-12">
                <p className="text-muted-foreground">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </div>
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