'use client';

import Link from "next/link"
import { ShoppingBag, Heart, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChannelSwitcher } from "@/components/channel-switcher"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">打开菜单</span>
          </Button>
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">
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
          <ChannelSwitcher />
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">搜索</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">收藏夹</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">购物车</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">账户</span>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 