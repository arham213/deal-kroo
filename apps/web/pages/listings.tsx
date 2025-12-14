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
import PropertyCardWeb from "../components/PropertyCard"
import ListingDetailsDrawer from "../components/ListingDetailsDrawer"
import ListingsFilterModal from "../components/ListingsFilterModal"
import AddListingModal from "../components/AddListingModal"
import { useAuthContext } from "../contexts/AuthContext"
import { useToast } from "../components/common/ToastContext"
import { LoggedInHeader } from "../components/common/LoggedInHeader"
import { Pagination } from "../components/common/Pagination"
import { Colors } from "@repo/utils/constants/colors"

const BASE_URL = "https://api.dealkroo.com/api"
const PAGE_SIZE = parseInt(process.env.PAGINATION_LIMIT || "25", 10)

const propertyTypeOptions: PropertyTypeTab[] = ["Plots", "Houses", "Commercial Plots"]
const filterTabs: ActiveFilterTab[] = ["All Listings", "For cash", "Installments"]

const ListingsPage: NextPage = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, logout } = useAuthContext()
  const { showInfoToast, showErrorToast } = useToast()
  const isVerified = user?.verificationStatus === "verified"

  const [listings, setListings] = useState<ListingState[]>([])
  const [activePropertyTab, setActivePropertyTab] = useState<PropertyTypeTab>("Plots")
  const [activeFilter, setActiveFilter] = useState<ActiveFilterTab>("All Listings")
  const [filters, setFilters] = useState<ListingsFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(false)
  const [selectedListing, setSelectedListing] = useState<ListingState | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isAddListingOpen, setIsAddListingOpen] = useState(false)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)

  // Show welcome popup once per session
  useEffect(() => {
    const popupShown = sessionStorage.getItem("listings_popup_shown")
    if (!popupShown && isAuthenticated) {
      setShowWelcomePopup(true)
    }
  }, [isAuthenticated])

  const handleClosePopup = () => {
    setShowWelcomePopup(false)
    sessionStorage.setItem("listings_popup_shown", "true")
  }

  const hasFilters = useMemo(
    () => Object.keys(filters || {}).length > 0 || activeFilter !== "All Listings",
    [filters, activeFilter],
  )

  const fetchListings = async (page: number, authToken?: string | null) => {
    setLoading(true)
    // setError(null)

    try {
      const effectiveToken = authToken ?? token

      if (!effectiveToken) {
        setListings([])
        showErrorToast("You must be signed in to view listings.")
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
        showErrorToast("Failed to fetch listings")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        showErrorToast("Your session has expired. Please sign in again.")
        await logout()
        router.replace("/auth/sign-in")
        return
      }

      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again later"
      showErrorToast(message)
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
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Logged-in Header */}
      <LoggedInHeader />

      {/* Main Content */}
      <div
        className="listings-main-content"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {/* Top Row: User Greeting | Property Tabs | Search + Add New */}
        <div
          className="listings-top-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {/* User Greeting */}
          <div className="listings-greeting" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              className="listings-greeting-avatar"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 600,
                color: "#333333",
              }}
            >
              {initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: "#000000" }}>
                Hi, {firstName}
              </span>
              {estateName && (
                <span style={{ fontSize: 14, color: "#666666" }}>
                  {estateName}
                </span>
              )}
            </div>
          </div>

          {/* Property Type Tabs */}
          <div
            className="listings-property-tabs"
            style={{
              display: "inline-flex",
              backgroundColor: "#f5f5f5",
              borderRadius: 100,
              padding: 4,
            }}
          >
            {propertyTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActivePropertyTab(type)}
                style={{
                  border: "none",
                  borderRadius: 100,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: activePropertyTab === type ? 400 : 400,
                  cursor: "pointer",
                  backgroundColor: activePropertyTab === type ? "#000000" : "transparent",
                  color: activePropertyTab === type ? "#ffffff" : "#333333",
                  transition: "all 0.2s",
                }}
              >
                {type === "Commercial Plots" ? "Commercial" : type}
              </button>
            ))}
          </div>

          {/* Search + Add New - in top row for desktop */}
          <div className="listings-search-section listings-search-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              className="listings-search-bar"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 100,
                padding: "10px 16px",
                minWidth: 240,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.66671 13.9997C11.1645 13.9997 14 11.1641 14 7.66634C14 4.16854 11.1645 1.33301 7.66671 1.33301C4.1689 1.33301 1.33337 4.16854 1.33337 7.66634C1.33337 11.1641 4.1689 13.9997 7.66671 13.9997Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.6667 14.6663L13.3334 13.333" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: 14,
                  color: "#000",
                  marginLeft: 8,
                  width: 120,
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
                  padding: 4,
                }}
                aria-label="Open filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 8.4375V15.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 2.8125V6.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.0625 14.0625V15.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.0625 2.8125V11.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.75 11.8125H12.375" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.9375 11.8125V15.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.9375 2.8125V9.5625" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.25 9.5625H5.625" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.6875 6.1875H7.3125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <button
              className="listings-add-btn"
              type="button"
              onClick={() => {
                if (!isVerified) {
                  showInfoToast("Your account needs to be verified to add listings.", "Access Restricted")
                  return
                }
                setIsAddListingOpen(true)
              }}
              style={{
                borderRadius: 100,
                padding: "12px 24px",
                border: "none",
                backgroundColor: isVerified ? "#000000" : "#999999",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 400,
                cursor: isVerified ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                opacity: isVerified ? 1 : 0.7,
              }}
            >
              Add New
            </button>
          </div>
        </div>

        {/* Filter Chips Row + Search on tablet/mobile */}
        <div
          className="listings-search-filter-row"
          style={{ marginBottom: 24 }}
        >
          {/* Filter Chips */}
          <div
            className="listings-filter-chips"
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                style={{
                  borderRadius: 100,
                  padding: "8px 18px",
                  border: `1px solid ${Colors.neutral60}`,
                  backgroundColor: activeFilter === tab ? Colors.neutral20 : "#ffffff",
                  color: "#262626",
                  fontSize: 13,
                  fontWeight: activeFilter === tab ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
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
                  color: "#22c55e",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "8px 16px",
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Search + Add New - shown on tablet/mobile only */}
          <div className="listings-search-section listings-search-mobile" style={{ display: "none", alignItems: "center", gap: 12 }}>
            <div
              className="listings-search-bar"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 100,
                padding: "10px 16px",
                minWidth: 240,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.66671 13.9997C11.1645 13.9997 14 11.1641 14 7.66634C14 4.16854 11.1645 1.33301 7.66671 1.33301C4.1689 1.33301 1.33337 4.16854 1.33337 7.66634C1.33337 11.1641 4.1689 13.9997 7.66671 13.9997Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.6667 14.6663L13.3334 13.333" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: 14,
                  color: "#000",
                  marginLeft: 8,
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
                  padding: 4,
                }}
                aria-label="Open filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 8.4375V15.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 2.8125V6.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.0625 14.0625V15.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.0625 2.8125V11.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.75 11.8125H12.375" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.9375 11.8125V15.1875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.9375 2.8125V9.5625" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.25 9.5625H5.625" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.6875 6.1875H7.3125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <button
              className="listings-add-btn"
              type="button"
              onClick={() => {
                if (!isVerified) {
                  showInfoToast("Your account needs to be verified to add listings.", "Access Restricted")
                  return
                }
                setIsAddListingOpen(true)
              }}
              style={{
                borderRadius: 100,
                padding: "12px 24px",
                border: "none",
                backgroundColor: isVerified ? "#000000" : "#999999",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 400,
                cursor: isVerified ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                opacity: isVerified ? 1 : 0.7,
              }}
            >
              Add New
            </button>
          </div>
        </div>

        {/* Listings Grid */}

        {loading ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "#666666",
            }}
          >
            Loading listings...
          </div>
        ) : listings.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "#666666",
              borderRadius: 12,
            }}
          >
            No listings found.
          </div>
        ) : (
          <div
            className="listings-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
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
        )
        }

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleChangePage}
          loading={loading}
        />

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

        <AddListingModal
          isOpen={isAddListingOpen}
          onClose={() => setIsAddListingOpen(false)}
          user={user}
          token={token}
          onSuccess={() => fetchListings(currentPage, token)}
        />

        {/* Welcome Popup - shows once per session */}
        {showWelcomePopup && (
          <div
            onClick={handleClosePopup}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999999,
              padding: 24,
              overflow: "auto",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "auto",
                maxHeight: "90vh",
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={handleClosePopup}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#ffffff",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
                aria-label="Close popup"
              >
                ✕
              </button>

              {/* Popup Image */}
              <img
                src="/popup-img.jpeg"
                alt="Welcome"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: 12,
                }}
              />
            </div>
          </div>
        )}
      </div >
    </div >
  )
}

export default ListingsPage



