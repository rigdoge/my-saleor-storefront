import { ChannelSwitcher } from "@/components/channel-switcher"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <a href="/about" className="text-sm leading-6 text-foreground/60 hover:text-foreground">
              About Us
            </a>
          </div>
          <div className="pb-6">
            <a href="/terms" className="text-sm leading-6 text-foreground/60 hover:text-foreground">
              Terms of Use
            </a>
          </div>
          <div className="pb-6">
            <a href="/privacy" className="text-sm leading-6 text-foreground/60 hover:text-foreground">
              Privacy Policy
            </a>
          </div>
          <div className="pb-6">
            <a href="/contact" className="text-sm leading-6 text-foreground/60 hover:text-foreground">
              Contact Us
            </a>
          </div>
        </nav>
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <ChannelSwitcher />
          <p className="text-center text-xs text-foreground/60">
            &copy; {new Date().getFullYear()} Saleor Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 