import { Header } from "@/components/layout/header"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              © 2024 Modern Store. All rights reserved.
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/about" className="hover:underline">
              About Us
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
} 