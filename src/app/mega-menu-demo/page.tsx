'use client';

import { useState } from 'react';
import { MegaMenu } from '@/components/layout/mega-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MegaMenuDemo() {
  const [activeStyle, setActiveStyle] = useState<'modern' | 'grid' | 'sidebar'>('modern');

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
          <h1 className="text-3xl font-bold tracking-tight">Mega Menu Demonstration</h1>
          <p className="text-muted-foreground mt-2">
            Three modern, sophisticated mega menu designs with real-time API data integration.
          </p>
        </div>
      </div>

      <Tabs defaultValue="design" className="mb-8">
        <TabsList>
          <TabsTrigger value="design">Design Showcase</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="mt-6">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h3>Three Premium Menu Designs</h3>
            <p>
              These mega menu designs represent modern web aesthetics with carefully considered UI patterns.
              Each provides a different layout approach optimized for various types of category structures.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-medium text-lg mb-2">Modern Style</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Clean dropdown-based design with dual-column subcategory display and featured image.
              </p>
              <Button 
                onClick={() => setActiveStyle('modern')} 
                variant={activeStyle === 'modern' ? 'default' : 'outline'}
                className="w-full"
              >
                Select Modern
              </Button>
            </div>
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-medium text-lg mb-2">Grid Style</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Tab-based navigation with visual grid layout for prominent category display.
              </p>
              <Button 
                onClick={() => setActiveStyle('grid')} 
                variant={activeStyle === 'grid' ? 'default' : 'outline'}
                className="w-full"
              >
                Select Grid
              </Button>
            </div>
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-medium text-lg mb-2">Sidebar Style</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Vertical sidebar navigation with focused content area for selected category.
              </p>
              <Button 
                onClick={() => setActiveStyle('sidebar')} 
                variant={activeStyle === 'sidebar' ? 'default' : 'outline'}
                className="w-full"
              >
                Select Sidebar
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Real-Time API Integration</h3>
            <p>
              All mega menu components are powered by actual GraphQL API data, 
              not static placeholders. The components fetch category data directly
              from your backend services.
            </p>
            
            <h4>GraphQL Query Example</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`query Categories($first: Int!, $channel: String!) {
  categories(first: $first, level: 0) {
    edges {
      node {
        id
        name
        slug
        description
        backgroundImage {
          url
          alt
        }
        children {
          edges {
            node {
              id
              name
              slug
              // Additional fields...
            }
          }
        }
      }
    }
  }
}`}
            </pre>
            
            <h4>Key Features</h4>
            <ul>
              <li>Dynamic data loading with loading states</li>
              <li>Automatic category hierarchy display</li>
              <li>Image handling with fallbacks</li>
              <li>Real product counts from the database</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Implementation Guide</h3>
            <p>
              Adding the mega menu to your application is straightforward:
            </p>
            
            <h4>Basic Usage</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`// In your layout or navigation component
import { MegaMenu } from '@/components/layout/mega-menu';

// Then in your component return:
<MegaMenu style="modern" /> // Choose from: 'modern', 'grid', or 'sidebar'`}
            </pre>
            
            <h4>Style Switching</h4>
            <p>
              The component supports dynamic style switching:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {`const [menuStyle, setMenuStyle] = useState('modern');

// Later in your component:
<MegaMenu style={menuStyle} />`}
            </pre>
            
            <h4>Additional Customization</h4>
            <p>
              The component can be further customized by modifying the CSS classes
              or extending the component's props in the source code.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-bold mb-6">Live Preview</h2>
        <MegaMenu style={activeStyle} />
      </div>
    </div>
  );
} 