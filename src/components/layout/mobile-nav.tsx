import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
  {
    href: "/",
    label: "首页",
  },
  {
    href: "/products",
    label: "全部商品",
  },
  {
    href: "/categories",
    label: "商品分类",
  },
  {
    href: "/brands",
    label: "品牌",
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">切换菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center">
            <span className="font-bold">Modern Store</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 px-7 py-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-lg transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
} 