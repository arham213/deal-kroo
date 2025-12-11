import type { ListingState } from "@repo/utils/types/listings"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import formatPrice from "@repo/utils/formatPrice"

type ListingDetailsDrawerProps = {
  isOpen: boolean
  onClose: () => void
  listing?: ListingState | null
}

function getTypeBadgeBackground(type: string | undefined) {
  switch (type) {
    case "cash":
      return Colors.backgroundCash
    case "installments":
      return Colors.backgroundInstallments
    default:
      return Colors.neutral20
  }
}

function getTypeBadgeTextColor(type: string | undefined) {
  switch (type) {
    case "cash":
      return Colors.textCash
    case "installments":
      return Colors.textInstallments
    default:
      return Colors.textSecondary
  }
}

export default function ListingDetailsDrawer({
  isOpen,
  onClose,
  listing,
}: ListingDetailsDrawerProps) {
  if (!isOpen || !listing) return null

  const title = `${listing.area} ${
    listing.propertyType === "house"
      ? "House"
      : listing.propertyType === "commercial plot"
        ? "Commercial Plot"
        : "Plot"
  }`

  const isPlot =
    listing.propertyType === "plot" || listing.propertyType === "commercial plot"

  const handleContact = () => {
    if (!listing.forContact) return
    if (typeof window !== "undefined") {
      window.location.href = `tel:${listing.forContact}`
    }
  }

  const renderInvoiceValue = () => {
    if (listing.listingType === "rent" && listing.rentPerMonth) {
      return `Rs. ${formatPrice(Number(listing.rentPerMonth))}`
    }

    const priceValue = listing.price || listing.totalPrice
    if (!priceValue) return "---"

    return `Rs. ${formatPrice(Number(priceValue))}`
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.24)",
      }}
      onClick={onClose}
    >
      <aside
        style={{
          width: 440,
          maxWidth: "100%",
          height: "100%",
          backgroundColor: Colors.neutral10,
          boxShadow: "-8px 0 40px rgba(15,23,42,0.20)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          style={{
            padding: spacing.lg,
            paddingBottom: spacing.md,
            borderBottom: `1px solid ${Colors.neutral40}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: fontSizes.base,
              fontWeight: fontWeights.bold,
              color: Colors.neutral100,
            }}
          >
            Details
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: radius.pill,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
            }}
            aria-label="Close details"
          >
            ✕
          </button>
        </header>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: spacing.lg,
            paddingBottom: spacing.xl,
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
            <DetailRow label="Title" value={title} />
            <DetailRow
              label="Type"
              value={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: `${spacing.xs}px ${spacing.sm}px`,
                    borderRadius: radius.lg,
                    backgroundColor: getTypeBadgeBackground(listing.listingType),
                    fontSize: fontSizes.xs,
                    fontWeight: fontWeights.medium,
                    color: getTypeBadgeTextColor(listing.listingType),
                  }}
                >
                  {listing.listingType === "cash"
                    ? "For Sale"
                    : listing.listingType === "rent"
                      ? "For Rent"
                      : "Installment"}
                </span>
              }
            />
            <DetailRow label="Price" value={renderInvoiceValue()} />
            {isPlot && (
              <DetailRow
                label="Price Per Marla"
                value={
                  listing.listingType === "cash" && listing.pricePerMarla
                    ? `Rs. ${formatPrice(Number(listing.pricePerMarla))}`
                    : "---"
                }
              />
            )}
            <DetailRow
              label="Address"
              value={`${isPlot ? listing.plotNo || "---" : listing.houseNo || "---"}, ${
                listing.block || "---"
              }, ${listing.phase || "---"}`}
            />
            <DetailRow label="Additional Area (Sq/ft)" value={listing.additionalArea || "---"} />
            <DetailRow
              label="Possession"
              value={
                listing.possession === true
                  ? "Yes"
                  : listing.possession === false
                    ? "No"
                    : "---"
              }
            />
            <DetailRow label="Description" value={listing.description || "---"} />
            <DetailRow label="Added by" value={listing.userId?.name || "---"} />
            <DetailRow label="Estate" value={listing.userId?.estateName || "---"} />
            <DetailRow label="Contact" value={listing.forContact || "---"} />
            <DetailRow label="Listing ID" value={listing._id || "---"} />
          </div>
        </div>

        {/* Footer buttons */}
        <div
          style={{
            padding: spacing.lg,
            borderTop: `1px solid ${Colors.neutral40}`,
            display: "flex",
            gap: spacing.sm,
            backgroundColor: Colors.neutral10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: `${spacing.md}px ${spacing.lg}px`,
              borderRadius: radius.pill,
              border: `1px solid ${Colors.neutral50}`,
              backgroundColor: Colors.neutral20,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.medium,
              color: Colors.neutral90,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContact}
            style={{
              flex: 1,
              padding: `${spacing.md}px ${spacing.lg}px`,
              borderRadius: radius.pill,
              border: "none",
              backgroundColor: Colors.neutral90,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              color: Colors.neutral10,
              cursor: listing.forContact ? "pointer" : "not-allowed",
              opacity: listing.forContact ? 1 : 0.6,
            }}
          >
            Contact
          </button>
        </div>
      </aside>
    </div>
  )
}

type DetailRowProps = {
  label: string
  value: React.ReactNode
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: spacing.md,
        borderBottom: `1px solid ${Colors.neutral30}`,
        gap: spacing.sm,
      }}
    >
      <span
        style={{
          flexBasis: "40%",
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.medium,
          color: Colors.black,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flexBasis: "60%",
          textAlign: "right",
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.bold,
          color: Colors.black,
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  )
}


