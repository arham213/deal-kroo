import { useMemo, useState } from "react"
import {
  type ActiveFilterTab,
  type ListingsFilters,
  type PropertyTypeTab,
} from "@repo/utils/listings/listingsQuery"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"

type ListingsFilterModalProps = {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: ListingsFilters) => void
  propertyType: PropertyTypeTab
  activeFilterTab: ActiveFilterTab
}

const AREA_OPTIONS = ["3 Marla", "5 Marla", "10 Marla", "15 Marla", "1 Kanal", "Custom", "All"]
const AREA_TYPE_OPTIONS = ["Marla", "Kanal"]

const RESEDENTIAL_BLOCKS = [
  "A block", "A-ext block", "B block", "C block", "C-ext block", "D block", "D-ext block",
  "E block", "F block", "G block", "H block", "I block", "J block", "J-ext block", "J-1 block",
  "K block", "L block", "M block", "N block", "N-ext block", "O block", "P block", "Q block",
  "Q-ext block", "R block", "R-ext block", "Overseas Zone 1", "Overseas Zone 2", "Overseas Zone 3",
  "Overseas Zone 4", "Overseas Zone 5",
]

const COMMERCIAL_BLOCKS = [
  "A block Market", "A2 Commercial", "B block market", "C block market", "C2 commercial",
  "D block commercial", "F block commercial", "F block D-shape commercial", "I block commercial",
  "J block commercial", "J-1 block commercial", "L block commercial", "L block D-shape commercial",
  "M block commercial", "N block commercial", "N-ext block commercial", "O block commercial",
  "P commercial zone", "P commercial shop", "R commercial", "R1 commercial", "R2 commercial",
  "R-ext commercial", "Hassan Commercial", "Joyland", "Overseas commercial zone 1",
  "Overseas commercial zone 2", "Overseas commercial zone 3", "Overseas commercial zone 4",
  "Overseas commercial zone 5",
]

export default function ListingsFilterModal({
  isOpen,
  onClose,
  onApply,
  propertyType,
}: ListingsFilterModalProps) {
  const [typeOfPlot, setTypeOfPlot] = useState<string | null>("On Cash")
  const [phase, setPhase] = useState<string | null>(null)
  const [block, setBlock] = useState<string | null>(null)
  const [selectedArea, setSelectedArea] = useState<string>("5 Marla")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [errors, setErrors] = useState<{ minPrice?: string; maxPrice?: string }>({})
  const [touched, setTouched] = useState({ minPrice: false, maxPrice: false })
  const [customAreaValue, setCustomAreaValue] = useState("")
  const [customAreaType, setCustomAreaType] = useState<string>("Marla")
  const [customAreaError, setCustomAreaError] = useState<string | undefined>(undefined)
  const [customAreaOpen, setCustomAreaOpen] = useState(false)

  const blockOptions = useMemo(
    () => (propertyType === "Commercial Plots" ? COMMERCIAL_BLOCKS : RESEDENTIAL_BLOCKS),
    [propertyType],
  )

  if (!isOpen) return null

  const inputStyle = {
    width: "100%",
    borderRadius: radius.pill,
    border: `1px solid ${Colors.border}`,
    padding: `${spacing.sm}px ${spacing.lg}px`,
    fontSize: fontSizes.sm,
    color: Colors.text,
    backgroundColor: Colors.inputBackground,
    outline: "none",
  }

  const selectStyle = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px center",
    paddingRight: spacing.xxl,
    cursor: "pointer",
  }

  const computePriceErrors = (min: string, max: string) => {
    const validation: { minPrice?: string; maxPrice?: string } = {}

    if (min) {
      if (!/^\d+(\.\d+)?$/.test(min)) {
        validation.minPrice = "Min price must be numeric"
      } else if (Number(min) < 0) {
        validation.minPrice = "Min price cannot be negative"
      }
    }

    if (max) {
      if (!/^\d+(\.\d+)?$/.test(max)) {
        validation.maxPrice = "Max price must be numeric"
      } else if (Number(max) < 0) {
        validation.maxPrice = "Max price cannot be negative"
      }
    }

    if (!validation.minPrice && !validation.maxPrice && min && max) {
      const minValue = Number(min)
      const maxValue = Number(max)
      if (!Number.isNaN(minValue) && !Number.isNaN(maxValue) && minValue > maxValue) {
        validation.minPrice = "Min price cannot exceed max price"
        validation.maxPrice = "Max price must be greater than min price"
      }
    }

    return validation
  }

  const handlePriceChange = (field: "minPrice" | "maxPrice") => (value: string) => {
    if (field === "minPrice") {
      setMinPrice(value)
    } else {
      setMaxPrice(value)
    }

    const nextMin = field === "minPrice" ? value : minPrice
    const nextMax = field === "maxPrice" ? value : maxPrice
    const validation = computePriceErrors(nextMin, nextMax)

    setErrors((prev) => ({
      ...prev,
      ...(field === "minPrice"
        ? { minPrice: touched.minPrice ? validation.minPrice : undefined }
        : { maxPrice: touched.maxPrice ? validation.maxPrice : undefined }),
      ...(touched.minPrice && field === "maxPrice" ? { minPrice: validation.minPrice } : {}),
      ...(touched.maxPrice && field === "minPrice" ? { maxPrice: validation.maxPrice } : {}),
    }))
  }

  const handlePriceBlur = (field: "minPrice" | "maxPrice") => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
    const validation = computePriceErrors(minPrice, maxPrice)
    setErrors(validation)
  }

  const handleAreaSelect = (area: string) => {
    if (area === "Custom") {
      setCustomAreaError(undefined)
      setCustomAreaOpen(true)
    } else {
      setSelectedArea(area)
      setCustomAreaError(undefined)
      setCustomAreaOpen(false)
    }
  }

  const handleCustomAreaSave = () => {
    if (!customAreaValue.trim()) {
      setCustomAreaError("Area value is required")
      return
    }
    if (!/^\d+(\.\d+)?$/.test(customAreaValue.trim())) {
      setCustomAreaError("Area value must be numeric")
      return
    }
    const customArea = `${customAreaValue.trim()} ${customAreaType}`
    setSelectedArea(customArea)
    setCustomAreaError(undefined)
    setCustomAreaOpen(false)
  }

  const handleApplyFilters = () => {
    const validation = computePriceErrors(minPrice, maxPrice)
    setErrors(validation)
    setTouched({ minPrice: true, maxPrice: true })

    if (validation.minPrice || validation.maxPrice || customAreaError) {
      return
    }

    const filters: ListingsFilters = {
      typeOfPlot,
      phase: phase || null,
      block: block || null,
      selectedArea,
      minPrice,
      maxPrice,
    }

    onApply(filters)
    onClose()
  }

  const handleClearFilters = () => {
    setTypeOfPlot("On Cash")
    setPhase(null)
    setBlock(null)
    setSelectedArea("5 Marla")
    setMinPrice("")
    setMaxPrice("")
    setCustomAreaValue("")
    setCustomAreaType("Marla")
    setCustomAreaOpen(false)
    setErrors({})
    setTouched({ minPrice: false, maxPrice: false })
    setCustomAreaError(undefined)
    onApply({})
    onClose()
  }

  return (
    <>
      <style>{`
        .filters-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 24px;
        }
        .filters-modal-content {
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: ${Colors.neutral10};
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          display: flex;
          flex-direction: column;
        }
        .filters-modal-content::-webkit-scrollbar {
          display: none;
        }
        .filters-modal-content input::placeholder,
        .filters-modal-content select option:disabled {
          color: #666 !important;
        }
        @media (max-width: 640px) {
          .filters-modal-overlay {
            padding: 16px;
          }
          .filters-modal-content {
            border-radius: 16px;
          }
        }
      `}</style>
      <div
        className="filters-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="filters-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <header
            style={{
              padding: `${spacing.lg}px ${spacing.xl}px`,
              borderBottom: `1px solid ${Colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.semibold,
                color: Colors.text,
              }}
            >
              Filters
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                backgroundColor: Colors.neutral10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close filters"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </header>

          {/* Content */}
          <div
            style={{
              padding: spacing.xl,
              flex: 1,
              overflowY: "auto",
            }}
          >
            {/* Type of plot */}
            <section style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: "block",
                  marginBottom: spacing.sm,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                }}
              >
                Type of plot
              </label>
              <div style={{ display: "flex", gap: spacing.sm, flexWrap: "wrap" }}>
                {["On Cash", "On Installments"].map((type) => {
                  const isActive = typeOfPlot === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeOfPlot(type)}
                      style={{
                        padding: `${spacing.sm}px ${spacing.lg}px`,
                        borderRadius: radius.pill,
                        border: `1px solid ${Colors.border}`,
                        backgroundColor: isActive ? Colors.neutral100 : Colors.neutral10,
                        color: isActive ? Colors.neutral10 : Colors.text,
                        fontSize: fontSizes.xs,
                        fontWeight: isActive ? fontWeights.medium : fontWeights.medium,
                        cursor: "pointer",
                      }}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Phase */}
            <section style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: "block",
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                  marginBottom: spacing.xs,
                }}
              >
                Phase
              </label>
              <select
                value={phase || ""}
                onChange={(e) => setPhase(e.target.value || null)}
                style={selectStyle}
              >
                <option value="" disabled style={{ color: "#666" }}>Select Phase</option>
                <option value="Phase 2">Phase 2</option>
              </select>
            </section>

            {/* Block */}
            <section style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: "block",
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                  marginBottom: spacing.xs,
                }}
              >
                Block
              </label>
              <select
                value={block || ""}
                onChange={(e) => setBlock(e.target.value || null)}
                style={selectStyle}
              >
                <option value="" disabled style={{ color: "#666" }}>Select Block</option>
                {blockOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </section>

            {/* Area */}
            <section style={{ marginBottom: spacing.lg }}>
              <label
                style={{
                  display: "block",
                  marginBottom: spacing.sm,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                }}
              >
                Area
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.xs }}>
                {AREA_OPTIONS.map((area) => {
                  const isCustomValue = !AREA_OPTIONS.includes(selectedArea)
                  const isActive = customAreaOpen
                    ? area === "Custom"
                    : area === "Custom"
                      ? isCustomValue
                      : selectedArea === area
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleAreaSelect(area)}
                      style={{
                        padding: `${spacing.xs}px ${spacing.md}px`,
                        borderRadius: radius.pill,
                        border: `1px solid ${Colors.border}`,
                        backgroundColor: isActive ? Colors.neutral100 : Colors.neutral10,
                        color: isActive ? Colors.neutral10 : Colors.text,
                        fontSize: fontSizes.xs,
                        fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
                        cursor: "pointer",
                      }}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>

              {/* Custom area controls - collapsible panel */}
              {customAreaOpen && (
                <div
                  style={{
                    marginTop: spacing.sm,
                    padding: spacing.md,
                    borderRadius: radius.lg,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.neutral10,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.xs,
                        fontWeight: fontWeights.medium,
                        color: Colors.text,
                      }}
                    >
                      Area value
                    </label>
                    <input
                      type="text"
                      placeholder="Enter value"
                      value={customAreaValue}
                      onChange={(e) => {
                        setCustomAreaValue(e.target.value)
                        if (customAreaError) setCustomAreaError(undefined)
                      }}
                      style={inputStyle}
                    />
                    {customAreaError && (
                      <p style={{ marginTop: spacing.xs, fontSize: fontSizes.xs, color: Colors.error }}>
                        {customAreaError}
                      </p>
                    )}
                  </div>
                  <div style={{ minWidth: 100 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.xs,
                        fontWeight: fontWeights.medium,
                        color: Colors.text,
                      }}
                    >
                      Type
                    </label>
                    <select
                      value={customAreaType}
                      onChange={(e) => {
                        setCustomAreaType(e.target.value)
                        if (customAreaError) setCustomAreaError(undefined)
                      }}
                      style={selectStyle}
                    >
                      {AREA_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: spacing.xs }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAreaOpen(false)
                        setCustomAreaError(undefined)
                      }}
                      style={{
                        borderRadius: radius.pill,
                        padding: `${spacing.xs}px ${spacing.md}px`,
                        border: `1px solid ${Colors.border}`,
                        backgroundColor: Colors.neutral10,
                        color: Colors.text,
                        fontSize: fontSizes.xs,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCustomAreaSave}
                      style={{
                        borderRadius: radius.pill,
                        padding: `${spacing.xs}px ${spacing.md}px`,
                        border: "none",
                        backgroundColor: Colors.neutral100,
                        color: Colors.neutral10,
                        fontSize: fontSizes.xs,
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Price range */}
            <section>
              <label
                style={{
                  display: "block",
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                  marginBottom: spacing.sm,
                }}
              >
                Price Range
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
                <div>
                  <input
                    type="text"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => handlePriceChange("minPrice")(e.target.value)}
                    onBlur={handlePriceBlur("minPrice")}
                    style={inputStyle}
                  />
                  {touched.minPrice && errors.minPrice && (
                    <p
                      style={{
                        marginTop: spacing.xs,
                        fontSize: fontSizes.xs,
                        color: Colors.error,
                      }}
                    >
                      {errors.minPrice}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange("maxPrice")(e.target.value)}
                    onBlur={handlePriceBlur("maxPrice")}
                    style={inputStyle}
                  />
                  {touched.maxPrice && errors.maxPrice && (
                    <p
                      style={{
                        marginTop: spacing.xs,
                        fontSize: fontSizes.xs,
                        color: Colors.error,
                      }}
                    >
                      {errors.maxPrice}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer
            style={{
              display: "flex",
              gap: spacing.sm,
              padding: `${spacing.lg}px ${spacing.xl}px`,
              borderTop: `1px solid ${Colors.border}`,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                padding: `${spacing.sm2}px ${spacing.lg}px`,
                borderRadius: radius.pill,
                border: `1px solid ${Colors.border}`,
                backgroundColor: Colors.neutral10,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.regular,
                color: Colors.text,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              style={{
                flex: 1,
                padding: `${spacing.sm2}px ${spacing.lg}px`,
                borderRadius: radius.pill,
                border: "none",
                backgroundColor: Colors.neutral100,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.regular,
                color: Colors.neutral10,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </footer>
        </div>
      </div>
    </>
  )
}
