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
  "A block",
  "A-ext block",
  "B block",
  "C block",
  "C-ext block",
  "D block",
  "D-ext block",
  "E block",
  "F block",
  "G block",
  "H block",
  "I block",
  "J block",
  "J-ext block",
  "J-1 block",
  "K block",
  "L block",
  "M block",
  "N block",
  "N-ext block",
  "O block",
  "P block",
  "Q block",
  "Q-ext block",
  "R block",
  "R-ext block",
  "Overseas Zone 1",
  "Overseas Zone 2",
  "Overseas Zone 3",
  "Overseas Zone 4",
  "Overseas Zone 5",
]

const COMMERCIAL_BLOCKS = [
  "A block Market",
  "A2 Commercial",
  "B block market",
  "C block market",
  "C2 commercial",
  "D block commercial",
  "F block commercial",
  "F block D-shape commercial",
  "I block commercial",
  "J block commercial",
  "J-1 block commercial",
  "L block commercial",
  "L block D-shape commercial",
  "M block commercial",
  "N block commercial",
  "N-ext block commercial",
  "O block commercial",
  "P commercial zone",
  "P commercial shop",
  "R commercial",
  "R1 commercial",
  "R2 commercial",
  "R-ext commercial",
  "Hassan Commercial",
  "Joyland",
  "Overseas commercial zone 1",
  "Overseas commercial zone 2",
  "Overseas commercial zone 3",
  "Overseas commercial zone 4",
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

  const blockOptions = useMemo(
    () => (propertyType === "Commercial Plots" ? COMMERCIAL_BLOCKS : RESEDENTIAL_BLOCKS),
    [propertyType],
  )

  if (!isOpen) return null

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
    } else {
      setSelectedArea(area)
      setCustomAreaError(undefined)
    }
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
    setErrors({})
    setTouched({ minPrice: false, maxPrice: false })
    setCustomAreaError(undefined)
    onApply({})
    onClose()
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          backgroundColor: Colors.neutral10,
          borderRadius: radius.xxl,
          boxShadow: "0 24px 60px rgba(15,23,42,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          style={{
            padding: `${spacing.lg}px ${spacing.xxl}px`,
            borderBottom: `1px solid ${Colors.border}`,
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
            Filters
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: fontSizes.base,
              color: Colors.text,
            }}
            aria-label="Close filters"
          >
            ✕
          </button>
        </header>

        {/* Content */}
        <div
          style={{
            padding: spacing.xxl,
            overflowY: "auto",
          }}
        >
          {/* Type of plot */}
          <section
            style={{
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.bold,
                color: Colors.black,
                marginBottom: spacing.sm,
              }}
            >
              Type of plot
            </h3>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {["On Cash", "On Installments"].map((type) => {
                const isActive = typeOfPlot === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeOfPlot(type)}
                    style={{
                      padding: `${spacing.sm}px ${spacing.lg}px`,
                      borderRadius: radius.lg2,
                      border: `1px solid ${
                        isActive ? Colors.neutral100 : Colors.neutral30
                      }`,
                      backgroundColor: isActive ? Colors.neutral100 : Colors.neutral10,
                      color: isActive ? Colors.neutral10 : Colors.neutral100,
                      fontSize: fontSizes.sm,
                      fontWeight: fontWeights.medium,
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
          <section
            style={{
              marginBottom: 24,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.bold,
                color: Colors.black,
                marginBottom: spacing.sm,
              }}
            >
              Phase
            </label>
            <select
              value={phase || ""}
              onChange={(e) => setPhase(e.target.value || null)}
              style={{
                width: "100%",
                padding: `${spacing.sm}px ${spacing.md}px`,
                borderRadius: radius.lg,
                border: `1px solid ${Colors.border}`,
                backgroundColor: Colors.inputBackground,
                fontSize: fontSizes.sm,
              }}
            >
              <option value="">Select Phase</option>
              <option value="Phase 2">Phase 2</option>
            </select>
          </section>

          {/* Block */}
          <section
            style={{
              marginBottom: 24,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.bold,
                color: Colors.black,
                marginBottom: spacing.sm,
              }}
            >
              Block
            </label>
            <select
              value={block || ""}
              onChange={(e) => setBlock(e.target.value || null)}
              style={{
                width: "100%",
                padding: `${spacing.sm}px ${spacing.md}px`,
                borderRadius: radius.lg,
                border: `1px solid ${Colors.border}`,
                backgroundColor: Colors.inputBackground,
                fontSize: fontSizes.sm,
              }}
            >
              <option value="">Select Block</option>
              {blockOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </section>

          {/* Area */}
          <section
            style={{
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.bold,
                color: Colors.black,
                marginBottom: spacing.sm,
              }}
            >
              Area
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {AREA_OPTIONS.map((area) => {
                const isActive = selectedArea === area
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleAreaSelect(area)}
                    style={{
                      padding: `${spacing.sm}px ${spacing.lg}px`,
                      borderRadius: radius.lg2,
                      border: `1px solid ${
                        isActive ? Colors.neutral100 : Colors.neutral30
                      }`,
                      backgroundColor: isActive ? Colors.neutral100 : Colors.neutral10,
                      color: isActive ? Colors.neutral10 : Colors.neutral100,
                      fontSize: fontSizes.sm,
                      fontWeight: fontWeights.medium,
                      cursor: "pointer",
                    }}
                  >
                    {area}
                  </button>
                )
              })}
            </div>

            {/* Custom area inline controls */}
            <div
              style={{
                display: "flex",
                gap: spacing.sm,
                marginTop: spacing.md,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: fontSizes.xs,
                    fontWeight: fontWeights.medium,
                    color: Colors.textSecondary,
                    marginBottom: spacing.xxxs,
                  }}
                >
                  Custom area value
                </label>
                <input
                  type="text"
                  value={customAreaValue}
                  onChange={(e) => {
                    setCustomAreaValue(e.target.value)
                    if (customAreaError) setCustomAreaError(undefined)
                  }}
                  placeholder="e.g. 7"
                  style={{
                    width: "100%",
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.inputBackground,
                    fontSize: fontSizes.sm,
                  }}
                />
              </div>
              <div style={{ width: 140 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: fontSizes.xs,
                    fontWeight: fontWeights.medium,
                    color: Colors.textSecondary,
                    marginBottom: spacing.xxxs,
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
                  style={{
                    width: "100%",
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.inputBackground,
                    fontSize: fontSizes.sm,
                  }}
                >
                  {AREA_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {customAreaError && (
              <p
                style={{
                  marginTop: spacing.xs,
                  fontSize: fontSizes.xs,
                  color: Colors.error,
                }}
              >
                {customAreaError}
              </p>
            )}
          </section>

          {/* Price range */}
          <section>
            <h3
              style={{
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.bold,
                color: Colors.black,
                marginBottom: spacing.sm,
              }}
            >
              Price Range
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => handlePriceChange("minPrice")(e.target.value)}
                  onBlur={handlePriceBlur("minPrice")}
                  style={{
                    width: "100%",
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.inputBackground,
                    fontSize: fontSizes.sm,
                  }}
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
                  style={{
                    width: "100%",
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.inputBackground,
                    fontSize: fontSizes.sm,
                  }}
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
            gap: 12,
            padding: `${spacing.md}px ${spacing.lg}px ${spacing.lg}px`,
            borderTop: `1px solid ${Colors.border}`,
          }}
        >
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              padding: `${spacing.sm}px ${spacing.lg}px`,
              borderRadius: radius.pill,
              border: `1px solid ${Colors.border}`,
              backgroundColor: Colors.inputBackground,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
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
              padding: `${spacing.sm}px ${spacing.lg}px`,
              borderRadius: radius.pill,
              border: "none",
              backgroundColor: Colors.primary,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              color: Colors.white,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  )
}


