"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useAuthContext } from "../../contexts/AuthContext"

export function LoggedInHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const { user } = useAuthContext()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "D"

    const navLinks = [
        { href: "/listings", label: "Home" },
        { href: "/my-notes", label: "Notes" },
        { href: "/my-listings", label: "My Listings" },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <>
            <style jsx global>{`
                @media (max-width: 768px) {
                    .logged-in-header-nav-desktop {
                        display: none !important;
                    }
                    .logged-in-header-mobile-toggle {
                        display: flex !important;
                    }
                }
                @media (min-width: 769px) {
                    .logged-in-header-nav-desktop {
                        display: flex !important;
                    }
                    .logged-in-header-mobile-toggle {
                        display: none !important;
                    }
                    .logged-in-header-mobile-menu {
                        display: none !important;
                    }
                }
            `}</style>
            <header
                style={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #f0f0f0",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "16px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <Link href="/listings" style={{ display: "flex", alignItems: "center" }}>
                        <Image
                            src="/black-logo.png"
                            alt="Deal Kroo"
                            width={120}
                            height={40}
                            style={{ height: 32, width: "auto" }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav
                        className="logged-in-header-nav-desktop"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 32,
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                style={{
                                    fontSize: 14,
                                    fontWeight: isActive(link.href) ? 500 : 400,
                                    color: isActive(link.href) ? "#000000" : "#999999",
                                    textDecoration: "none",
                                    transition: "color 0.2s",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side: User Initials + Mobile Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* User Initials */}
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#333333",
                                cursor: "pointer",
                            }}
                            onClick={() => router.push("/profile")}
                        >
                            {initials}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="logged-in-header-mobile-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                display: "none",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                padding: 0,
                            }}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        className="logged-in-header-mobile-menu"
                        style={{
                            borderTop: "1px solid #f0f0f0",
                            backgroundColor: "#ffffff",
                            padding: "16px 24px",
                        }}
                    >
                        <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        fontSize: 16,
                                        fontWeight: isActive(link.href) ? 500 : 400,
                                        color: isActive(link.href) ? "#000000" : "#666666",
                                        textDecoration: "none",
                                        padding: "8px 0",
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>
        </>
    )
}
