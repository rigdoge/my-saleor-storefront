import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/components/providers"
import { ChannelProvider } from "@/components/providers/channel-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { FavoritesProvider } from "@/components/providers/favorites-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Saleor商城",
  description: "基于Saleor的现代电商平台",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/logo.svg",
    apple: [
      { url: "/icons/icon-192x192.png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Saleor商城" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="商城" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/logo.svg" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <ChannelProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <div className="relative flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                  </FavoritesProvider>
                </CartProvider>
              </ChannelProvider>
            </AuthProvider>
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 