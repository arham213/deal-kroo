"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing, radius } from "@repo/utils/styles/tokens"

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

  const navLinkStyle = {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: Colors.neutral10,
    textDecoration: "none",
    transition: "opacity 0.2s",
  }

  return (
    <>
      <style>{`
        .header-nav-link:hover {
          opacity: 0.7;
        }
        .header-mobile-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <header
        style={{
          borderBottom: `1px solid ${Colors.neutral80}`,
          backgroundColor: "rgb(var(--background) / var(--tw-bg-opacity, 1))",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: `0 ${spacing.lg}px`,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
            <Image src="/white-logo-web.png" alt="Deal Kroo" width={160} height={53} style={{ height: 40, width: "auto" }} />
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: "none", alignItems: "center", gap: spacing.xxl }} className="desktop-nav">
            <Link href="/#features" className="header-nav-link" style={navLinkStyle}>
              Features
            </Link>
            <Link href="/#about" className="header-nav-link" style={navLinkStyle}>
              About
            </Link>
            <Link href="/privacy-policy" className="header-nav-link" style={navLinkStyle}>
              Privacy Policy
            </Link>
            <Link href="/delete-account" className="header-nav-link" style={navLinkStyle}>
              Delete Account
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
            {/* Desktop Auth Buttons */}
            <div className="desktop-nav" style={{ display: "none", alignItems: "center", gap: spacing.md }}>
              <Link
                href="/auth/sign-in"
                className="header-nav-link"
                style={{
                  ...navLinkStyle,
                  padding: `${spacing.sm}px ${spacing.lg}px`,
                }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${spacing.sm}px ${spacing.xl}px`,
                  borderRadius: radius.pill,
                  backgroundColor: Colors.neutral10,
                  color: Colors.text,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="header-mobile-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                display: "flex",
                padding: spacing.sm,
                borderRadius: radius.sm,
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: Colors.neutral10,
              }}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              borderTop: `1px solid ${Colors.neutral80}`,
              backgroundColor: Colors.neutral100,
            }}
          >
            <nav
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: `${spacing.lg}px`,
                display: "flex",
                flexDirection: "column",
                gap: spacing.lg,
              }}
            >
              <button
                onClick={() => handleNavigation("/#features")}
                style={{
                  ...navLinkStyle,
                  padding: `${spacing.sm}px 0`,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation("/#about")}
                style={{
                  ...navLinkStyle,
                  padding: `${spacing.sm}px 0`,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                About
              </button>
              <button
                onClick={() => handleNavigation("/privacy-policy")}
                style={{
                  ...navLinkStyle,
                  padding: `${spacing.sm}px 0`,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleNavigation("/delete-account")}
                style={{
                  ...navLinkStyle,
                  padding: `${spacing.sm}px 0`,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete Account
              </button>
              <div style={{ display: "flex", gap: spacing.md, marginTop: spacing.sm }}>
                <Link
                  href="/auth/sign-in"
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: `${spacing.sm}px ${spacing.lg}px`,
                    borderRadius: radius.pill,
                    border: `1px solid ${Colors.neutral60}`,
                    backgroundColor: "transparent",
                    color: Colors.neutral10,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: `${spacing.sm}px ${spacing.lg}px`,
                    borderRadius: radius.pill,
                    backgroundColor: Colors.neutral10,
                    color: Colors.text,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
