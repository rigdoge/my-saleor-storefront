'use client';

import { useState } from 'react';
import { ApiMegaMenu } from '@/components/layout/api-mega-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ApiMenuDemo() {
  const [activeStyle, setActiveStyle] = useState<'modern' | 'grid' | 'sidebar'>('modern');
  const [menuSlug, setMenuSlug] = useState<string>('main-menu');

  return (
    <div className="container py-8">
      <div className="flex items-center mb-12">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API-Driven Mega Menu</h1>
          <p className="text-muted-foreground mt-2">
            Modern mega menu designs using real-time menu data from API
          </p>
        </div>
      </div>

      <Tabs defaultValue="preview" className="mb-8">
        <TabsList>
          <TabsTrigger value="preview">Menu Preview</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="mt-6">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h3>Custom Menu Styles</h3>
            <p>
              These menu designs are powered by your backend menu structure, dynamically loading all menu items,
              sub-items, and their associated images or metadata.
            </p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1/3">
              <label className="text-sm font-medium block mb-2">
                Menu Slug
              </label>
              <div className="flex gap-2">
                <Input 
                  value={menuSlug} 
                  onChange={(e) => setMenuSlug(e.target.value)}
                  placeholder="e.g. main-menu"
                />
                <Button onClick={() => setMenuSlug('main-menu')}>
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="w-2/3">
              <label className="text-sm font-medium block mb-2">
                Menu Style
              </label>
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  onClick={() => setActiveStyle('modern')} 
                  variant={activeStyle === 'modern' ? 'default' : 'outline'}
                  className="justify-start"
                >
                  Modern Style
                </Button>
                <Button 
                  onClick={() => setActiveStyle('grid')} 
                  variant={activeStyle === 'grid' ? 'default' : 'outline'}
                  className="justify-start"
                >
                  Grid Style
                </Button>
                <Button 
                  onClick={() => setActiveStyle('sidebar')} 
                  variant={activeStyle === 'sidebar' ? 'default' : 'outline'}
                  className="justify-start"
                >
                  Sidebar Style
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <ApiMegaMenu menuSlug={menuSlug} style={activeStyle} />
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Real Menu API Integration</h3>
            <p>
              The mega menu is fully integrated with your backend menu API, pulling complete
              menu structure including nested items, links, and associated media.
            </p>
            
            <h4>GraphQL Menu Query</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`query MainMenu {
  menu(slug: "main-menu") {
    id
    name
    slug
    items {
      id
      name
      url
      category {
        id
        name
        slug
        backgroundImage {
          url
          alt
        }
        products {
          totalCount
        }
      }
      children {
        id
        name
        url
        // Additional fields...
      }
    }
  }
}`}
            </pre>
            
            <h4>Key Features</h4>
            <ul>
              <li>Full menu hierarchy support (items, children, grandchildren)</li>
              <li>Associated content links (categories, collections, pages)</li>
              <li>Background images and visual metadata</li>
              <li>Automatic product counts</li>
              <li>Intelligent error states and loading indicators</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Implementation Guide</h3>
            <p>
              Implementing the API-based mega menu is straightforward:
            </p>
            
            <h4>Basic Usage</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`// Import the component
import { ApiMegaMenu } from '@/components/layout/api-mega-menu';

// Use in your layout or page
<ApiMegaMenu 
  menuSlug="main-menu" 
  style="modern" // 'modern', 'grid', or 'sidebar'
/>`}
            </pre>
            
            <h4>Dynamic Customization</h4>
            <p>
              You can also control the menu dynamically:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`const [menuStyle, setMenuStyle] = useState('modern');
const [currentMenu, setCurrentMenu] = useState('main-menu');

// Later in your component:
<ApiMegaMenu 
  menuSlug={currentMenu}
  style={menuStyle} 
/>`}
            </pre>
            
            <h4>Backend Requirements</h4>
            <p>
              The component expects your backend to support the GraphQL menu queries defined in 
              <code>src/lib/graphql/queries/menus.ts</code>. Your menu structure should include:
            </p>
            <ul>
              <li>Top-level menu items</li>
              <li>Child items (sub-menus)</li>
              <li>Optional grandchild items (nested sub-menus)</li>
              <li>Links to categories, collections, or pages</li>
              <li>Custom URLs</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 