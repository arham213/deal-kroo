import { useState, useEffect, useRef } from "react"
import type { ListingState } from "@repo/utils/types/listings"
import type { User } from "@repo/utils/types/auth"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { formatRelativeTimeLibrary } from "@repo/utils/formatDateNow"
import formatPrice from "@repo/utils/formatPrice"

type PropertyCardProps = {
    property: ListingState
    currentUser: User | null
    onDelete?: (id: string) => void
    showDeleteMenu?: boolean
    onOpenDetails?: (property: ListingState) => void
}

export default function PropertyCardWeb({
    property,
    currentUser,
    onDelete,
    showDeleteMenu,
    onOpenDetails,
}: PropertyCardProps) {
    const isVerified = currentUser?.verificationStatus === "verified"
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isMenuOpen])

    const handleContact = () => {
        if (!property.forContact) return
        if (typeof window !== "undefined") {
            window.location.href = `tel:${property.forContact}`
        }
    }

    const nameParts = property.userId?.name?.split(" ") ?? []
    const firstName = nameParts[0] ?? "Unknown"
    const lastInitial = nameParts[1] ? `${nameParts[1][0]}.` : ""
    const displayName = `${firstName} ${lastInitial}`.trim()

    const estateName = property.userId?.estateName
    const truncatedEstateName =
        estateName && estateName.length > 20 ? `${estateName.slice(0, 20)}...` : estateName

    const initials = property.userId?.name
        ? property.userId.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U"

    const title = `${property.area}`

    const priceContent = (() => {
        if (property.listingType === "rent" && property.rentPerMonth) {
            return (
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: spacing.xxxs,
                    }}
                >
                    <span
                        style={{
                            fontSize: fontSizes.base,
                            fontWeight: fontWeights.semibold,
                            color: Colors.black,
                        }}
                    >
                        Rs. {formatPrice(Number(property.rentPerMonth))}
                    </span>
                    <span
                        style={{
                            fontSize: fontSizes.sm,
                            fontWeight: fontWeights.medium,
                            color: Colors.neutral80,
                        }}
                    >
                        /month
                    </span>
                </div>
            )
        }

        if (
            property.listingType === "cash" &&
            (property.propertyType === "plot" || property.propertyType === "commercial plot") &&
            property.pricePerMarla
        ) {
            return (
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: spacing.xxxs,
                    }}
                >
                    <span
                        style={{
                            fontSize: fontSizes.base,
                            fontWeight: fontWeights.semibold,
                            color: Colors.black,
                        }}
                    >
                        Rs. {formatPrice(Number(property.pricePerMarla))}
                    </span>
                    <span
                        style={{
                            fontSize: fontSizes.sm,
                            fontWeight: fontWeights.regular,
                            color: Colors.neutral80,
                        }}
                    >
                        /Marla
                    </span>
                </div>
            )
        }

        const priceValue = property.price || property.totalPrice
        if (!priceValue) return null

        return (
            <span
                style={{
                    fontSize: fontSizes.base,
                    fontWeight: fontWeights.semibold,
                    color: Colors.black,
                }}
            >
                Rs. {formatPrice(Number(priceValue))}
            </span>
        )
    })()

    const listingTypeLabel =
        property.listingType === "cash"
            ? "Cash"
            : property.listingType === "rent"
                ? "For Rent"
                : "Installment"

    return (
        <article
            style={{
                backgroundColor: Colors.neutral10,
                borderRadius: radius.lg,
                border: `1px solid ${Colors.neutral40}`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {isVerified && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: `${spacing.xs}px ${spacing.sm}px`,
                        backgroundColor: property.possession
                            ? Colors.backgroundPossession
                            : Colors.backgroundNonPossession,
                    }}
                >
                    <span
                        style={{
                            fontSize: fontSizes.xs,
                            fontWeight: fontWeights.regular,
                            color: property.possession ? Colors.textPossession : Colors.textNonPossession,
                        }}
                    >
                        {property.possession ? "Possession" : "Non-Possession"}
                    </span>
                </div>
            )}

            <div
                style={{
                    padding: spacing.lg,
                    display: "flex",
                    flexDirection: "column",
                    gap: spacing.lg,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: spacing.sm,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: spacing.sm,
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: spacing.xs,
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: fontSizes.base,
                                    fontWeight: fontWeights.semibold,
                                    color: Colors.black,
                                    margin: 0,
                                }}
                            >
                                {title}
                            </h2>
                        </div>
                        {priceContent}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: spacing.sm,
                            marginTop: -spacing.xxs,
                        }}
                    >
                        {isVerified && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: fontSizes.xs,
                                        color: Colors.neutral80,
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M6.99999 7.83434C8.00515 7.83434 8.81999 7.01949 8.81999 6.01434C8.81999 5.00918 8.00515 4.19434 6.99999 4.19434C5.99483 4.19434 5.17999 5.00918 5.17999 6.01434C5.17999 7.01949 5.99483 7.83434 6.99999 7.83434Z" stroke="#404040" strokeWidth="1.5" />
                                        <path d="M2.11167 4.95283C3.26084 -0.0988398 10.745 -0.0930063 11.8883 4.95866C12.5592 7.92199 10.7158 10.4303 9.1 11.982C7.9275 13.1137 6.0725 13.1137 4.89417 11.982C3.28417 10.4303 1.44084 7.91616 2.11167 4.95283Z" stroke="#404040" strokeWidth="1.5" />
                                    </svg>
                                </span>
                                <span
                                    style={{
                                        fontSize: fontSizes.xs,
                                        color: Colors.neutral80,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {property.plotNo || property.houseNo || ""}, {property.phase}, {property.block}
                                </span>
                            </div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: spacing.xxxs,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span
                                style={{
                                    fontSize: fontSizes.xs,
                                    color: Colors.neutral80,
                                }}
                            >
                                {formatRelativeTimeLibrary(property.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: spacing.sm,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: spacing.xxxs,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: spacing.sm,
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: radius.pill,
                                    backgroundColor: Colors.neutral30,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: fontSizes.xs,
                                    fontWeight: fontWeights.semibold,
                                    color: Colors.text,
                                }}
                            >
                                {initials}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: spacing.xxxs,
                                    minWidth: 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: fontSizes.sm,
                                        color: Colors.neutral100,
                                        fontWeight: fontWeights.medium,
                                    }}
                                >
                                    {displayName}
                                </span>
                                {truncatedEstateName && (
                                    <span
                                        style={{
                                            fontSize: fontSizes.xs,
                                            color: Colors.neutral80,
                                        }}
                                    >
                                        {truncatedEstateName}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: `${spacing.xs}px ${spacing.sm}px`,
                            borderRadius: radius.lg,
                            backgroundColor:
                                property.listingType === "cash"
                                    ? Colors.backgroundCash
                                    : Colors.backgroundInstallments,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <span
                            style={{
                                fontSize: fontSizes.xs,
                                fontWeight: fontWeights.regular,
                                color:
                                    property.listingType === "cash"
                                        ? Colors.textCash
                                        : Colors.textInstallments,
                            }}
                        >
                            {listingTypeLabel}
                        </span>
                    </div>
                </div>

                {isVerified && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: spacing.sm,
                                marginTop: spacing.sm,
                            }}
                        >
                            {/* Three-dot menu for delete */}
                            {showDeleteMenu && onDelete && (
                                <div ref={menuRef} style={{ position: "relative" }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 24,
                                            height: 24,
                                            border: "none",
                                            backgroundColor: "transparent",
                                            cursor: "pointer",
                                            padding: 0,
                                        }}
                                        aria-label="More options"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="4" height="16" viewBox="0 0 4 16" fill="none">
                                            <circle cx="2" cy="2" r="2" fill="#757575" />
                                            <circle cx="2" cy="8" r="2" fill="#757575" />
                                            <circle cx="2" cy="14" r="2" fill="#757575" />
                                        </svg>
                                    </button>
                                    {isMenuOpen && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "100%",
                                                left: 0,
                                                marginBottom: 4,
                                                backgroundColor: "#ffffff",
                                                borderRadius: radius.md,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                padding: `${spacing.xs}px`,
                                                zIndex: 10,
                                                minWidth: 100,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onDelete(property._id)
                                                    setIsMenuOpen(false)
                                                }}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    width: "100%",
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    color: "#DC2626",
                                                    fontSize: fontSizes.sm,
                                                    fontWeight: fontWeights.medium,
                                                    cursor: "pointer",
                                                    padding: `${spacing.xs}px ${spacing.sm}px`,
                                                    borderRadius: radius.sm,
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                    <path d="M14 3.98665C11.78 3.76665 9.54667 3.65332 7.32 3.65332C6 3.65332 4.68 3.71999 3.36 3.85332L2 3.98665" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5.66669 3.31334L5.81335 2.44001C5.92002 1.80668 6.00002 1.33334 7.12669 1.33334H8.87335C10 1.33334 10.0867 1.83334 10.1867 2.44668L10.3334 3.31334" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12.5667 6.09332L12.1334 12.8067C12.06 13.8533 12 14.6667 10.14 14.6667H5.86002C4.00002 14.6667 3.94002 13.8533 3.86669 12.8067L3.43335 6.09332" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6.88666 11H9.10666" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6.33331 8.33334H9.66665" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => onOpenDetails?.(property)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: spacing.sm,
                                    flex: 1,
                                    borderRadius: radius.pill,
                                    padding: `${spacing.xs}px ${spacing.md}px`,
                                    border: `1px solid ${Colors.border}`,
                                    backgroundColor: Colors.neutral10,
                                    color: Colors.textSecondary,
                                    fontSize: fontSizes.xs,
                                    fontWeight: fontWeights.regular,
                                    cursor: "pointer",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                    <path d="M9.08835 6.49971C9.08835 7.57221 8.15502 8.43888 7.00002 8.43888C5.84502 8.43888 4.91168 7.57221 4.91168 6.49971C4.91168 5.42721 5.84502 4.56055 7.00002 4.56055C8.15502 4.56055 9.08835 5.42721 9.08835 6.49971Z" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.99997 10.9792C9.05914 10.9792 10.9783 9.85257 12.3141 7.90257C12.8391 7.13882 12.8391 5.85506 12.3141 5.09131C10.9783 3.14131 9.05914 2.01465 6.99997 2.01465C4.9408 2.01465 3.02164 3.14131 1.6858 5.09131C1.1608 5.85506 1.1608 7.13882 1.6858 7.90257C3.02164 9.85257 4.9408 10.9792 6.99997 10.9792Z" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> <span>Details</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleContact}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: spacing.sm,
                                    flex: 1,
                                    borderRadius: radius.pill,
                                    padding: `${spacing.xs}px ${spacing.md}px`,
                                    border: "none",
                                    backgroundColor: Colors.neutral20,
                                    color: Colors.neutral90,
                                    fontSize: fontSizes.xs,
                                    fontWeight: fontWeights.regular,
                                    cursor: "pointer",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M12.8159 10.6928C12.8159 10.9028 12.7692 11.1187 12.67 11.3287C12.5709 11.5387 12.4425 11.737 12.2734 11.9237C11.9875 12.2387 11.6725 12.4662 11.3167 12.612C10.9667 12.7578 10.5875 12.8337 10.1792 12.8337C9.58419 12.8337 8.94835 12.6937 8.27752 12.4078C7.60669 12.122 6.93585 11.737 6.27085 11.2528C5.60002 10.7628 4.96419 10.2203 4.35752 9.61949C3.75669 9.01283 3.21419 8.37699 2.73002 7.71199C2.25169 7.04699 1.86669 6.38199 1.58669 5.72283C1.30669 5.05783 1.16669 4.42199 1.16669 3.81533C1.16669 3.41866 1.23669 3.03949 1.37669 2.68949C1.51669 2.33366 1.73835 2.00699 2.04752 1.71533C2.42085 1.34783 2.82919 1.16699 3.26085 1.16699C3.42419 1.16699 3.58752 1.20199 3.73335 1.27199C3.88502 1.34199 4.01919 1.44699 4.12419 1.59866L5.47752 3.50616C5.58252 3.65199 5.65835 3.78616 5.71085 3.91449C5.76335 4.03699 5.79252 4.15949 5.79252 4.27033C5.79252 4.41033 5.75169 4.55033 5.67002 4.68449C5.59419 4.81866 5.48335 4.95866 5.34335 5.09866L4.90002 5.55949C4.83585 5.62366 4.80669 5.69949 4.80669 5.79283C4.80669 5.83949 4.81252 5.88033 4.82419 5.92699C4.84169 5.97366 4.85919 6.00866 4.87085 6.04366C4.97585 6.23616 5.15669 6.48699 5.41335 6.79033C5.67585 7.09366 5.95585 7.40283 6.25919 7.71199C6.57419 8.02116 6.87752 8.30699 7.18669 8.56949C7.49002 8.82616 7.74085 9.00116 7.93919 9.10616C7.96835 9.11783 8.00335 9.13533 8.04419 9.15283C8.09085 9.17033 8.13752 9.17616 8.19002 9.17616C8.28919 9.17616 8.36502 9.14116 8.42919 9.07699L8.87252 8.63949C9.01835 8.49366 9.15835 8.38283 9.29252 8.31283C9.42669 8.23116 9.56085 8.19033 9.70669 8.19033C9.81752 8.19033 9.93419 8.21366 10.0625 8.26616C10.1909 8.31866 10.325 8.39449 10.4709 8.49366L12.4017 9.86449C12.5534 9.96949 12.6584 10.092 12.7225 10.2378C12.7809 10.3837 12.8159 10.5295 12.8159 10.6928Z" stroke="#757575" strokeWidth="1.5" strokeMiterlimit="10" />
                                </svg>
                                <span>Contact</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </article>
    )
}
