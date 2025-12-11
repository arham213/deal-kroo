import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import {
  buildListingsRequest,
  type ActiveFilterTab,
  type ListingsFilters,
  type PropertyTypeTab,
} from "@repo/utils/listings/listingsQuery"
import type { ListingState } from "@repo/utils/types/listings"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import PropertyCardWeb from "../components/PropertyCard"
import ListingDetailsDrawer from "../components/ListingDetailsDrawer"
import ListingsFilterModal from "../components/ListingsFilterModal"
import { useAuthContext } from "../contexts/AuthContext"

const BASE_URL = "https://deal-karo-backend.vercel.app/api"
const PAGE_SIZE = parseInt(process.env.PAGINATION_LIMIT || "25", 10)

const propertyTypeOptions: PropertyTypeTab[] = ["Plots", "Houses", "Commercial Plots"]
const filterTabs: ActiveFilterTab[] = ["All Listings", "For cash", "Installments"]

const ListingsPage: NextPage = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, logout } = useAuthContext()

  const [listings, setListings] = useState<ListingState[]>([])
  const [activePropertyTab, setActivePropertyTab] = useState<PropertyTypeTab>("Plots")
  const [activeFilter, setActiveFilter] = useState<ActiveFilterTab>("All Listings")
  const [filters, setFilters] = useState<ListingsFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedListing, setSelectedListing] = useState<ListingState | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const hasFilters = useMemo(
    () => Object.keys(filters || {}).length > 0 || activeFilter !== "All Listings",
    [filters, activeFilter],
  )

  const fetchListings = async (page: number, authToken?: string | null) => {
    setLoading(true)
    setError(null)

    try {
      const effectiveToken = authToken ?? token

      if (!effectiveToken) {
        setListings([])
        setError("You must be signed in to view listings.")
        return
      }

      const { url, params } = buildListingsRequest({
        page,
        limit: PAGE_SIZE,
        search: searchQuery,
        filters,
        propertyTab: activePropertyTab,
        activeFilterTab: activeFilter,
      })

      const response = await axios.get(`${BASE_URL}${url}`, {
        params,
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      })

      if (response?.data?.success) {
        const { properties, pagination } = response.data.data
        setListings(properties || [])
        setCurrentPage(pagination?.page || page || 1)
        setTotalPages(pagination?.totalPages || 1)
      } else {
        setError("Failed to fetch listings")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.")
        await logout()
        router.replace("/auth/sign-in")
        return
      }

      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again later"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Redirect to sign-in if not authenticated (after auth check completes)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/sign-in")
    }
  }, [isLoading, isAuthenticated, router])

  // Initial + filters/search effect (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated || !token) return

    setCurrentPage(1)
    fetchListings(1, token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePropertyTab, activeFilter, searchQuery, filters, isAuthenticated, token])

  const handleChangePage = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return
    setCurrentPage(page)
    fetchListings(page, token)
  }

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  )

  const firstName = user?.name?.split(" ")[0] ?? "Dealer"
  const estateName = user?.estateName
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "D"

  const handleOpenDetails = (listing: ListingState) => {
    setSelectedListing(listing)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
  }

  const handleApplyFilters = (nextFilters: ListingsFilters) => {
    setFilters(nextFilters)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: Colors.headerBackground,
        padding: `${spacing.xxxl}px ${spacing.screen}px`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          backgroundColor: Colors.neutral10,
          borderRadius: radius.xxl,
          padding: spacing.xl,
          boxShadow: "0 12px 40px rgba(15,23,42,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: spacing.xl,
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: spacing.md,
            flexWrap: "wrap",
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
                width: 44,
                height: 44,
                borderRadius: radius.pill,
                backgroundColor: Colors.neutral30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSizes.sm,
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
              }}
            >
              <span
                style={{
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                }}
              >
                Hi, {firstName}
              </span>
              {estateName && (
                <span
                  style={{
                    fontSize: fontSizes.xs,
                    color: Colors.textSecondary,
                  }}
                >
                  {estateName}
                </span>
              )}
            </div>
          </div>

          {/* Property type tabs */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: Colors.neutral20,
              borderRadius: radius.pill,
              padding: spacing.xs,
              gap: spacing.xs,
            }}
          >
            {propertyTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActivePropertyTab(type)}
                style={{
                  border: "none",
                  borderRadius: radius.pill,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  fontSize: fontSizes.xs,
                  cursor: "pointer",
                  backgroundColor:
                    activePropertyTab === type ? Colors.neutral100 : "transparent",
                  color: activePropertyTab === type ? Colors.neutral10 : Colors.text,
                  fontWeight: activePropertyTab === type ? fontWeights.semibold : fontWeights.medium,
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search + Add New */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.sm,
              minWidth: 260,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 380,
                display: "flex",
                alignItems: "center",
                padding: `${spacing.sm}px ${spacing.md}px`,
                borderRadius: radius.pill,
                border: "none",
                backgroundColor: Colors.neutral20,
              }}
            >
              <span
                style={{
                  fontSize: fontSizes.base,
                  color: Colors.textSecondary,
                  marginRight: spacing.xs,
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: fontSizes.sm,
                  backgroundColor: "transparent",
                }}
              />
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: Colors.textSecondary,
                  fontSize: fontSizes.base,
                  marginLeft: spacing.xs,
                }}
                aria-label="Open filters"
              >
                ⚙
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push("/add-listing")}
              style={{
                borderRadius: radius.pill,
                padding: `${spacing.sm}px ${spacing.lg}px`,
                border: "none",
                backgroundColor: Colors.neutral100,
                color: Colors.neutral10,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.semibold,
                cursor: "pointer",
              }}
            >
              Add New
            </button>
          </div>
        </header>

        {/* Filter row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacing.sm,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: spacing.xs,
              flexWrap: "wrap",
            }}
          >
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                style={{
                  borderRadius: radius.pill,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  border: `1px solid ${Colors.border}`,
                  backgroundColor:
                    activeFilter === tab ? Colors.neutral100 : Colors.neutral10,
                  color: activeFilter === tab ? Colors.neutral10 : Colors.text,
                  fontSize: fontSizes.xs,
                  fontWeight: activeFilter === tab ? fontWeights.semibold : fontWeights.medium,
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Status row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: fontSizes.xs,
            color: Colors.textSecondary,
            flexWrap: "wrap",
            gap: spacing.xs,
          }}
        >
          <span>
            {loading
              ? "Loading listings..."
              : `${listings.length} listing${listings.length === 1 ? "" : "s"} found`}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setFilters({})
                setActiveFilter("All Listings")
              }}
              style={{
                border: "none",
                background: "none",
                color: Colors.primary,
                cursor: "pointer",
                fontSize: fontSizes.xs,
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Listings grid */}
        {error ? (
          <div
            style={{
              padding: spacing.md,
              borderRadius: radius.md,
              backgroundColor: Colors.backgroundCash,
              color: Colors.textCash,
              fontSize: fontSizes.sm,
            }}
          >
            {error}
          </div>
        ) : listings.length === 0 && !loading ? (
          <div
            style={{
              padding: spacing.xxxl,
              borderRadius: radius.lg,
              backgroundColor: Colors.neutral10,
              textAlign: "center",
              color: Colors.textSecondary,
            }}
          >
            No listings found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: spacing.md,
            }}
          >
            {listings.map((listing) => (
              <PropertyCardWeb
                key={listing._id}
                property={listing}
                currentUser={user ?? null}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        )}

        {/* Numbered pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Listings pages"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.xs,
              marginTop: spacing.sm,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              style={{
                padding: `${spacing.xs}px ${spacing.sm}px`,
                borderRadius: radius.pill,
                border: `1px solid ${Colors.border}`,
                backgroundColor: Colors.neutral10,
                cursor:
                  currentPage === 1 || loading ? "not-allowed" : "pointer",
                fontSize: fontSizes.xs,
                opacity: currentPage === 1 || loading ? 0.5 : 1,
              }}
            >
              Prev
            </button>

            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handleChangePage(page)}
                disabled={loading}
                style={{
                  minWidth: 32,
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: radius.pill,
                  border: `1px solid ${Colors.border}`,
                  backgroundColor:
                    page === currentPage ? Colors.neutral100 : Colors.neutral10,
                  color: page === currentPage ? Colors.neutral10 : Colors.text,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: fontSizes.xs,
                  fontWeight: page === currentPage ? fontWeights.semibold : fontWeights.medium,
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              style={{
                padding: `${spacing.xs}px ${spacing.sm}px`,
                borderRadius: radius.pill,
                border: `1px solid ${Colors.border}`,
                backgroundColor: Colors.neutral10,
                cursor:
                  currentPage === totalPages || loading
                    ? "not-allowed"
                    : "pointer",
                fontSize: fontSizes.xs,
                opacity: currentPage === totalPages || loading ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </nav>
        )}

        <ListingDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          listing={selectedListing}
        />

        <ListingsFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          propertyType={activePropertyTab}
          activeFilterTab={activeFilter}
        />
      </div>
    </div>
  )
}

export default ListingsPage


