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

  const title = `${property.area} ${
    property.propertyType === "house"
      ? "House"
      : property.propertyType === "commercial plot"
        ? "Commercial Plot"
        : "Plot"
  }`

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
              fontWeight: fontWeights.medium,
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
      ? "For Sale"
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
              fontWeight: fontWeights.medium,
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
                  fontWeight: fontWeights.bold,
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
                  📍
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
              <span
                style={{
                  fontSize: fontSizes.xs,
                  color: Colors.neutral80,
                }}
              >
                ⏱
              </span>
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
            <span
              style={{
                fontSize: fontSizes.xs,
                color: Colors.neutral80,
              }}
            >
              Added by
            </span>
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
                    fontWeight: fontWeights.semibold,
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
                fontWeight: fontWeights.medium,
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

        {/* {property.description && (
          <p
            style={{
              fontSize: fontSizes.sm,
              color: Colors.text,
              margin: 0,
            }}
          >
            {property.description.length > 140
              ? `${property.description.slice(0, 140)}...`
              : property.description}
          </p>
        )} */}

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
              <button
                type="button"
                onClick={() => onOpenDetails?.(property)}
                style={{
                  flex: 1,
                  borderRadius: radius.pill,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  border: `1px solid ${Colors.border}`,
                  backgroundColor: Colors.neutral10,
                  color: Colors.textSecondary,
                  fontSize: fontSizes.xs,
                  fontWeight: fontWeights.medium,
                  cursor: "pointer",
                }}
              >
                ● Details
              </button>
              <button
                type="button"
                onClick={handleContact}
                style={{
                  flex: 1,
                  borderRadius: radius.pill,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  border: "none",
                  backgroundColor: Colors.neutral20,
                  color: Colors.neutral90,
                  fontSize: fontSizes.xs,
                  fontWeight: fontWeights.medium,
                  cursor: "pointer",
                }}
              >
                ☎ Contact
              </button>
            </div>

            {showDeleteMenu && onDelete && (
              <div
                style={{
                  marginTop: spacing.sm,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => onDelete(property._id)}
                  style={{
                    borderRadius: radius.pill,
                    padding: `${spacing.xs}px ${spacing.md}px`,
                    border: `1px solid ${Colors.error}`,
                    backgroundColor: "#FEF2F2",
                    color: "#B91C1C",
                    fontSize: fontSizes.xs,
                    fontWeight: fontWeights.semibold,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  )
}


