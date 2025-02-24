import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/products",
    label: "All Products",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/brands",
    label: "Brands",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          Modern Store
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
} 