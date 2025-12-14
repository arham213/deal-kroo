"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Menu, X, Apple } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false)

    // Check if it's an anchor link on the same page
    const isAnchorLink = href.startsWith("/#")
    const currentPage = href.split("#")[0] || "/"
    const isNewPage = currentPage !== pathname

    router.push(href)

    // Only scroll to top if navigating to a new page (not anchor links)
    if (isNewPage && !isAnchorLink) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    }
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/white-logo.png" alt="Deal Kroo" width={160} height={53} className="h-8 md:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/delete-account" className="text-sm font-medium hover:text-primary transition-colors">
            Delete Account
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button size="sm" className="hidden md:flex" asChild>
            <a href="https://apps.apple.com/us/app/deal-kroo/id6755895370" target="_blank" rel="noopener noreferrer">
              <Apple className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
          {/* </CHANGE> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button
              onClick={() => handleNavigation("/#features")}
              className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
            >
              Features
            </button>
            <button
              onClick={() => handleNavigation("/#about")}
              className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("/privacy-policy")}
              className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigation("/delete-account")}
              className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
            >
              Delete Account
            </button>
            <Button size="sm" className="w-full" asChild>
              <a href="https://apps.apple.com/us/app/deal-kroo/id6755895370" target="_blank" rel="noopener noreferrer">
                <Apple className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            {/* </CHANGE> */}
          </nav>
        </div>
      )}
    </header>
  )
}
