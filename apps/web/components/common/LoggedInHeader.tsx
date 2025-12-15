"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useAuthContext } from "../../contexts/AuthContext"
import { useToast } from "./ToastContext"
import { AnnouncementBar } from "./AnnouncementBar"
import { Colors } from "@repo/utils/constants/colors"
import { spacing, fontSizes, fontWeights, radius } from "@repo/utils/styles/tokens"

export function LoggedInHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuthContext()
    const { showSuccessToast, showInfoToast } = useToast()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const isVerified = user?.verificationStatus === "verified"

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "D"

    const navLinks = [
        { href: "/listings", label: "Home", protected: false },
        { href: "/my-notes", label: "Notes", protected: true },
        { href: "/my-listings", label: "My Listings", protected: true },
    ]

    const isActive = (href: string) => pathname === href

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleNavigation = (href: string, isProtected: boolean) => {
        if (isProtected && !isVerified) {
            showInfoToast(
                "Your account needs to be verified to access this feature. Please wait for verification.",
                "Access Restricted"
            )
            return
        }
        router.push(href)
    }

    const handleLogout = async () => {
        setDropdownOpen(false)
        await logout()
        showSuccessToast("You have been logged out successfully")
        router.push("/auth/sign-in")
    }

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
                .avatar-dropdown-item:hover {
                    background-color: ${Colors.neutral20};
                }
                .nav-link-disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
            {/* Announcement Bar for unverified users */}
            <AnnouncementBar user={user} />
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
                            <button
                                key={link.label}
                                onClick={() => handleNavigation(link.href, link.protected)}
                                className={link.protected && !isVerified ? "nav-link-disabled" : ""}
                                style={{
                                    fontSize: 14,
                                    fontWeight: isActive(link.href) ? 500 : 400,
                                    color: isActive(link.href) ? "#000000" : link.protected && !isVerified ? "#cccccc" : "#999999",
                                    background: "none",
                                    border: "none",
                                    cursor: link.protected && !isVerified ? "not-allowed" : "pointer",
                                    transition: "color 0.2s",
                                    padding: 0,
                                }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right side: User Initials + Mobile Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* User Initials with Dropdown */}
                        <div ref={dropdownRef} style={{ position: "relative" }}>
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
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {initials}
                            </div>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: 0,
                                        backgroundColor: Colors.neutral10,
                                        borderRadius: radius.lg,
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                                        border: `1px solid ${Colors.border}`,
                                        minWidth: 180,
                                        overflow: "hidden",
                                        zIndex: 100,
                                    }}
                                >
                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="avatar-dropdown-item"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: spacing.md,
                                            padding: `${spacing.md}px ${spacing.lg}px`,
                                            fontSize: fontSizes.sm,
                                            fontWeight: fontWeights.medium,
                                            color: Colors.text,
                                            textDecoration: "none",
                                            transition: "background-color 0.2s",
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        View Profile
                                    </Link>
                                    <div style={{ height: 1, backgroundColor: Colors.border }} />
                                    <button
                                        onClick={handleLogout}
                                        className="avatar-dropdown-item"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: spacing.md,
                                            padding: `${spacing.md}px ${spacing.lg}px`,
                                            fontSize: fontSizes.sm,
                                            fontWeight: fontWeights.medium,
                                            color: Colors.error,
                                            width: "100%",
                                            border: "none",
                                            backgroundColor: "transparent",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "background-color 0.2s",
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
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
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            height: "calc(100vh - 60px)", // Approximate header height
                            zIndex: 49,
                        }}
                    >
                        <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        handleNavigation(link.href, link.protected)
                                    }}
                                    style={{
                                        fontSize: 16,
                                        fontWeight: isActive(link.href) ? 500 : 400,
                                        color: isActive(link.href) ? "#000000" : link.protected && !isVerified ? "#cccccc" : "#666666",
                                        background: "none",
                                        border: "none",
                                        cursor: link.protected && !isVerified ? "not-allowed" : "pointer",
                                        padding: "8px 0",
                                        textAlign: "left",
                                    }}
                                >
                                    {link.label}
                                </button>
                            ))}
                            <div style={{ height: 1, backgroundColor: "#f0f0f0", margin: "8px 0" }} />
                            <Link
                                href="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    color: "#666666",
                                    textDecoration: "none",
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                View Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    color: Colors.error,
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </button>
                        </nav>
                    </div>
                )}
            </header>
        </>
    )
}
