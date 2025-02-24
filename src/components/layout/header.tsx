'use client';

import Link from "next/link"
import { Heart, User, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/providers/auth-provider"
import { CartButton } from "@/components/cart/cart-button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SearchCommand } from "@/components/search/search-command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Header() {
  const { user, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="items-center space-x-2 flex">
              <span className="font-bold">
                Saleor商城
              </span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="/categories"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                分类
              </Link>
              <Link
                href="/products"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                商品
              </Link>
              <Link
                href="/about"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                关于
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden lg:flex">
              <Button
                variant="outline"
                className="relative h-10 w-full justify-start text-sm text-muted-foreground sm:w-64 sm:pr-12"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>搜索商品...</span>
                <kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <nav className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">搜索</span>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/account/favorites">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">收藏夹</span>
                  </Link>
                </Button>
                <CartButton />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">用户菜单</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {user.firstName || user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account">个人中心</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/orders">我的订单</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/favorites">我的收藏</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => logout()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>退出登录</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/login">
                      <User className="h-5 w-5" />
                      <span className="sr-only">登录</span>
                    </Link>
                  </Button>
                )}
                <ThemeToggle />
              </nav>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer />
      <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
} 