import { useEffect, useMemo, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import type { AreaSize } from "@repo/utils/types/listings"
import {
  buildAddListingPayload,
  createAddListingTouchedState,
  createInitialAddListingState,
  createListing,
  FORM_FIELDS,
  getTotalPrice,
  hasBlockingListingErrors,
  isValidatableListingField,
  validateAddListingForm,
  validateListingField,
  type AddListingErrors,
  type AddListingState,
  type ListingField,
} from "@repo/utils/listings/addListing"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { Validation } from "@repo/utils/validation"
import { useAuthContext } from "../contexts/AuthContext"

const AREA_TYPE_OPTIONS = ["Marla", "Kanal"] as const
const PRESET_AREA_SIZES: AreaSize[] = ["3 Marla", "5 Marla", "10 Marla", "15 Marla", "1 Kanal"]

const PHASE_OPTIONS = ["Phase 2"] as const

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
] as const

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
] as const

const AddListingPage: NextPage = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, logout } = useAuthContext()

  const [formData, setFormData] = useState<AddListingState>(createInitialAddListingState)
  const [errors, setErrors] = useState<AddListingErrors>({})
  const [touched, setTouched] = useState<Record<ListingField, boolean>>(
    createAddListingTouchedState(false),
  )
  const [loading, setLoading] = useState(false)

  const [customAreaOpen, setCustomAreaOpen] = useState(false)
  const [customAreaValue, setCustomAreaValue] = useState("")
  const [customAreaType, setCustomAreaType] = useState<(typeof AREA_TYPE_OPTIONS)[number]>("Marla")
  const [customAreaError, setCustomAreaError] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(true)

  const isVerified = user?.verificationStatus === "verified"

  // Redirect unauthenticated users to sign-in once auth check completes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/sign-in")
    }
  }, [isLoading, isAuthenticated, router])

  // If user is authenticated but not verified, show a gate screen
  if (!isLoading && isAuthenticated && user && !isVerified) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.headerBackground,
          padding: `${spacing.xxxl}px ${spacing.screen}px`,
        }}
      >
        <div
          style={{
            maxWidth: 560,
            width: "100%",
            backgroundColor: Colors.neutral10,
            borderRadius: radius.xxl,
            padding: spacing.xl,
            boxShadow: "0 12px 40px rgba(15,23,42,0.25)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: fontSizes.lg,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.sm,
            }}
          >
            Verification Required
          </h1>
          <p
            style={{
              fontSize: fontSizes.sm,
              color: Colors.textSecondary,
              marginBottom: spacing.md,
            }}
          >
            Your account must be verified by an admin to add listings. Please wait for verification
            or contact support.
          </p>
          <button
            type="button"
            onClick={() => router.push("/listings")}
            style={{
              borderRadius: radius.pill,
              padding: `${spacing.md2}px ${spacing.lg}px`,
              border: "none",
              backgroundColor: Colors.neutral100,
              color: Colors.neutral10,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              cursor: "pointer",
            }}
          >
            Go to Listings
          </button>
        </div>
      </div>
    )
  }

  const updateTouchedErrors = (state: AddListingState) => {
    setErrors((prev) => {
      const nextErrors = { ...prev }
      FORM_FIELDS.forEach((field) => {
        if (touched[field]) {
          const fieldValue = state[field] as string
          const errorMessage = validateListingField(field, fieldValue, state)
          if (errorMessage) {
            nextErrors[field] = errorMessage
          } else {
            delete nextErrors[field]
          }
        }
      })
      return nextErrors
    })
  }

  const updateForm = (updater: (prev: AddListingState) => AddListingState) => {
    setFormData((prev) => {
      const next = updater(prev)
      updateTouchedErrors(next)
      return next
    })
  }

  // Auto-calc total price when pricePerMarla / area / additionalArea change (for cash plot/commercial)
  useEffect(() => {
    const isPlotOrCommercial =
      formData.propertyType === "plot" || formData.propertyType === "commercial plot"
    const isCashListing = formData.listingType === "cash"

    if (isPlotOrCommercial && isCashListing) {
      if (formData.pricePerMarla && formData.area) {
        const calculatedPrice = getTotalPrice(
          formData.pricePerMarla,
          formData.area,
          formData.additionalArea || "",
        )

        updateForm((prev) => ({
          ...prev,
          price: calculatedPrice,
        }))

        const shouldValidatePrice = touched.pricePerMarla || touched.area
        if (shouldValidatePrice && !touched.price) {
          setTouched((prev) => ({
            ...prev,
            price: true,
          }))
        }

        if (shouldValidatePrice || touched.price) {
          const nextState: AddListingState = {
            ...formData,
            price: calculatedPrice,
          }
          const errorMessage = validateListingField("price", calculatedPrice, nextState)
          setErrors((prev) => {
            const nextErrors = { ...prev }
            if (errorMessage) {
              nextErrors.price = errorMessage
            } else {
              delete nextErrors.price
            }
            return nextErrors
          })
        }
      } else if (touched.pricePerMarla || touched.area) {
        if (!formData.pricePerMarla || !formData.area) {
          setErrors((prev) => {
            const nextErrors = { ...prev }
            delete nextErrors.price
            return nextErrors
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.pricePerMarla,
    formData.area,
    formData.additionalArea,
    formData.propertyType,
    formData.listingType,
    touched.pricePerMarla,
    touched.area,
    touched.price,
  ])

  const handleInputChange = (
    key: keyof AddListingState,
    value: string | boolean,
    options?: { forceValidate?: boolean },
  ) => {
    if (key === "propertyType") {
      const propertyType = value as AddListingState["propertyType"]
      updateForm((prev) => ({
        ...prev,
        propertyType,
        listingType: "cash",
        plotNo: propertyType === "plot" || propertyType === "commercial plot" ? prev.plotNo : "",
        houseNo: propertyType === "house" ? prev.houseNo : "",
        pricePerMarla:
          propertyType === "plot" || propertyType === "commercial plot" ? prev.pricePerMarla : "",
        installmentPerMonth: "",
        installmentHalfYearly: "",
      }))
      return
    }

    if (key === "listingType") {
      const listingType = value as AddListingState["listingType"]
      updateForm((prev) => ({
        ...prev,
        listingType,
        installmentPerMonth: listingType === "installments" ? prev.installmentPerMonth : "",
        installmentHalfYearly: listingType === "installments" ? prev.installmentHalfYearly : "",
        pricePerMarla:
          prev.propertyType === "plot" || prev.propertyType === "commercial plot"
            ? prev.pricePerMarla
            : "",
      }))
      return
    }

    updateForm((prev) => ({
      ...prev,
      [key]: value,
    }))

    if (
      typeof value === "string" &&
      isValidatableListingField(key) &&
      (options?.forceValidate || touched[key as ListingField])
    ) {
      const nextState = {
        ...formData,
        [key]: value,
      } as AddListingState
      const errorMessage = validateListingField(key as ListingField, value, nextState)
      setErrors((prev) => {
        const nextErrors = { ...prev }
        if (errorMessage) {
          nextErrors[key as ListingField] = errorMessage
        } else {
          delete nextErrors[key as ListingField]
        }
        return nextErrors
      })
    }
  }

  const handleFieldBlur = (field: ListingField) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    const value = (formData[field] as unknown as string) || ""
    const errorMessage = validateListingField(field, value, formData)
    setErrors((prev) => {
      const nextErrors = { ...prev }
      if (errorMessage) {
        nextErrors[field] = errorMessage
      } else {
        delete nextErrors[field]
      }
      return nextErrors
    })
  }

  const markAllTouched = () => {
    setTouched(createAddListingTouchedState(true))
  }

  const hasBlockingErrors = useMemo(
    () => hasBlockingListingErrors(formData),
    [formData],
  )

  const isSubmitDisabled = loading || hasBlockingErrors

  const handleAddListing = async () => {
    const { isValid, errors: validationErrors } = validateAddListingForm(formData)
    setErrors(validationErrors)
    if (!isValid) {
      markAllTouched()
      return
    }

    if (!token || !user) {
      await logout()
      router.replace("/auth/sign-in")
      return
    }

    setLoading(true)
    try {
      const payload = buildAddListingPayload(formData, user)
      await createListing({
        token,
        payload,
      })

      alert("Listing added successfully")
      router.replace("/my-listings")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const allAreaSizes: AreaSize[] = [...PRESET_AREA_SIZES, "custom" as AreaSize]

  const handleAreaSelect = (size: AreaSize) => {
    setTouched((prev) => ({
      ...prev,
      area: true,
    }))

    if (size === "custom") {
      setCustomAreaError(null)
      setCustomAreaOpen(true)
    } else {
      handleInputChange("area", size, { forceValidate: true })
      setCustomAreaOpen(false)
    }
  }

  const handleCustomAreaSave = () => {
    const trimmed = customAreaValue.trim()
    if (!trimmed) {
      setCustomAreaError("Area value is required")
      return
    }
    if (!Validation.isNumeric(trimmed)) {
      setCustomAreaError("Area value must be numeric")
      return
    }

    const customArea = `${trimmed} ${customAreaType}` as AreaSize
    setTouched((prev) => ({
      ...prev,
      area: true,
    }))
    handleInputChange("area", customArea, { forceValidate: true })
    setCustomAreaError(null)
    setCustomAreaOpen(false)
    setCustomAreaValue("")
    setCustomAreaType("Marla")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: Colors.headerBackground,
        padding: `${spacing.xxxl}px ${spacing.screen}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 40,
            padding: spacing.xl,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: Colors.neutral10,
              borderRadius: radius.xxl,
              padding: spacing.xl,
              boxShadow: "0 20px 60px rgba(15,23,42,0.45)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.lg,
                gap: spacing.sm,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: fontSizes.xl,
                    fontWeight: fontWeights.bold,
                    color: Colors.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  Add Listing
                </h1>
                <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                  Create a new property listing with price, area, and installment options.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPopupOpen(false)
                  router.back()
                }}
                style={{
                  borderRadius: radius.pill,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  border: `1px solid ${Colors.border}`,
                  backgroundColor: Colors.neutral10,
                  cursor: "pointer",
                  fontSize: fontSizes.sm,
                }}
              >
                Close
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                void handleAddListing()
              }}
              style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}
            >
              {/* Property type */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.sm,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    color: Colors.text,
                  }}
                >
                  Property Type
                </label>
                <div
                  style={{
                    display: "inline-flex",
                    borderRadius: radius.pill,
                    backgroundColor: Colors.neutral20,
                    padding: spacing.xs,
                    gap: spacing.xs,
                  }}
                >
                  {["plot", "house", "commercial plot"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange("propertyType", type)}
                      style={{
                        border: "none",
                        borderRadius: radius.pill,
                        padding: `${spacing.xs}px ${spacing.md}px`,
                        fontSize: fontSizes.xs,
                        cursor: "pointer",
                        backgroundColor:
                          formData.propertyType === type ? Colors.neutral100 : "transparent",
                        color: formData.propertyType === type ? Colors.neutral10 : Colors.text,
                        fontWeight:
                          formData.propertyType === type ? fontWeights.semibold : fontWeights.medium,
                      }}
                    >
                      {type === "plot"
                        ? "Plot"
                        : type === "house"
                          ? "House"
                          : "Commercial plot"}
                    </button>
                  ))}
                </div>
              </section>

              {/* Listing type (Cash / Installments) */}
              {formData.propertyType !== "house" && (
                <section>
                  <label
                    style={{
                      display: "block",
                      marginBottom: spacing.sm,
                      fontSize: fontSizes.sm,
                      fontWeight: fontWeights.semibold,
                      color: Colors.text,
                    }}
                  >
                    What is it for?
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {/* Cash / Installments */}
                    {["cash", "installments"].map((lt) => (
                      <button
                        key={lt}
                        type="button"
                        onClick={() => handleInputChange("listingType", lt)}
                        style={{
                          padding: `${spacing.sm}px ${spacing.lg}px`,
                          borderRadius: radius.pill,
                          border: `1px solid ${Colors.border}`,
                          backgroundColor:
                            formData.listingType === lt ? Colors.neutral100 : Colors.neutral10,
                          color: formData.listingType === lt ? Colors.neutral10 : Colors.text,
                          fontSize: fontSizes.xs,
                          fontWeight:
                            formData.listingType === lt ? fontWeights.semibold : fontWeights.medium,
                          cursor: "pointer",
                        }}
                      >
                        {lt === "cash" ? "Cash" : "Installments"}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Plot / House no */}
              {(formData.propertyType === "plot" ||
                formData.propertyType === "commercial plot") && (
                  <section>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.medium,
                        color: Colors.text,
                      }}
                    >
                      Plot No
                    </label>
                    <input
                      type="text"
                      placeholder="Eg., 101"
                      value={formData.plotNo}
                      onChange={(e) => handleInputChange("plotNo", e.target.value)}
                      onBlur={handleFieldBlur("plotNo")}
                      style={{
                        width: "100%",
                        borderRadius: radius.md,
                        border: `1px solid ${touched.plotNo && errors.plotNo ? Colors.error : Colors.border}`,
                        padding: `${spacing.sm}px ${spacing.md}px`,
                        fontSize: fontSizes.sm,
                      }}
                    />
                    {touched.plotNo && errors.plotNo && (
                      <p
                        style={{
                          marginTop: spacing.xs,
                          fontSize: fontSizes.xs,
                          color: Colors.error,
                        }}
                      >
                        {errors.plotNo}
                      </p>
                    )}
                  </section>
                )}

              {formData.propertyType === "house" && (
                <section>
                  <label
                    style={{
                      display: "block",
                      marginBottom: spacing.xs,
                      fontSize: fontSizes.sm,
                      fontWeight: fontWeights.medium,
                      color: Colors.text,
                    }}
                  >
                    House No
                  </label>
                  <input
                    type="text"
                    placeholder="Eg., 101"
                    value={formData.houseNo}
                    onChange={(e) => handleInputChange("houseNo", e.target.value)}
                    onBlur={handleFieldBlur("houseNo")}
                    style={{
                      width: "100%",
                      borderRadius: radius.md,
                      border: `1px solid ${touched.houseNo && errors.houseNo ? Colors.error : Colors.border}`,
                      padding: `${spacing.sm}px ${spacing.md}px`,
                      fontSize: fontSizes.sm,
                    }}
                  />
                  {touched.houseNo && errors.houseNo && (
                    <p
                      style={{
                        marginTop: spacing.xs,
                        fontSize: fontSizes.xs,
                        color: Colors.error,
                      }}
                    >
                      {errors.houseNo}
                    </p>
                  )}
                </section>
              )}

              {/* Phase */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.xs,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    color: Colors.text,
                  }}
                >
                  Phase
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) =>
                    handleInputChange("phase", e.target.value, { forceValidate: true })
                  }
                  onBlur={handleFieldBlur("phase")}
                  style={{
                    width: "100%",
                    borderRadius: radius.pill,
                    border: `1px solid ${touched.phase && errors.phase ? Colors.error : Colors.border}`,
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    fontSize: fontSizes.sm,
                    backgroundColor: Colors.inputBackground,
                  }}
                >
                  <option value="">Select Phase</option>
                  {PHASE_OPTIONS.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
                {touched.phase && errors.phase && (
                  <p
                    style={{
                      marginTop: spacing.xs,
                      fontSize: fontSizes.xs,
                      color: Colors.error,
                    }}
                  >
                    {errors.phase}
                  </p>
                )}
              </section>

              {/* Block */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.xs,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    color: Colors.text,
                  }}
                >
                  Block
                </label>
                <select
                  value={formData.block}
                  onChange={(e) =>
                    handleInputChange("block", e.target.value, { forceValidate: true })
                  }
                  onBlur={handleFieldBlur("block")}
                  style={{
                    width: "100%",
                    borderRadius: radius.pill,
                    border: `1px solid ${touched.block && errors.block ? Colors.error : Colors.border}`,
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    fontSize: fontSizes.sm,
                    backgroundColor: Colors.inputBackground,
                  }}
                >
                  <option value="">Select Block</option>
                  {(formData.propertyType === "commercial plot"
                    ? COMMERCIAL_BLOCKS
                    : RESEDENTIAL_BLOCKS
                  ).map((block) => (
                    <option key={block} value={block}>
                      {block}
                    </option>
                  ))}
                </select>
                {touched.block && errors.block && (
                  <p
                    style={{
                      marginTop: spacing.xs,
                      fontSize: fontSizes.xs,
                      color: Colors.error,
                    }}
                  >
                    {errors.block}
                  </p>
                )}
              </section>

              {/* Area */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.sm,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    color: Colors.text,
                  }}
                >
                  Area
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: spacing.xs,
                  }}
                >
                  {allAreaSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleAreaSelect(size)}
                      style={{
                        padding: `${spacing.xs}px ${spacing.md}px`,
                        borderRadius: radius.pill,
                        border: `1px solid ${Colors.border}`,
                        backgroundColor:
                          formData.area === size ? Colors.neutral100 : Colors.neutral10,
                        color: formData.area === size ? Colors.neutral10 : Colors.text,
                        fontSize: fontSizes.xs,
                        fontWeight:
                          formData.area === size ? fontWeights.semibold : fontWeights.medium,
                        cursor: "pointer",
                      }}
                    >
                      {size === "custom" ? "Custom" : size}
                    </button>
                  ))}
                </div>
                {customAreaOpen && (
                  <div
                    style={{
                      marginTop: spacing.sm,
                      padding: spacing.sm,
                      borderRadius: radius.md,
                      border: `1px solid ${Colors.border}`,
                      backgroundColor: Colors.neutral10,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: spacing.sm,
                      alignItems: "center",
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
                          if (customAreaError) setCustomAreaError(null)
                        }}
                        style={{
                          width: "100%",
                          borderRadius: radius.md,
                          border: `1px solid ${customAreaError ? Colors.error : Colors.border}`,
                          padding: `${spacing.xs}px ${spacing.sm}px`,
                          fontSize: fontSizes.xs,
                        }}
                      />
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
                    </div>
                    <div style={{ minWidth: 120 }}>
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
                        onChange={(e) => setCustomAreaType(e.target.value as any)}
                        style={{
                          width: "100%",
                          borderRadius: radius.md,
                          border: `1px solid ${Colors.border}`,
                          padding: `${spacing.xs}px ${spacing.sm}px`,
                          fontSize: fontSizes.xs,
                          backgroundColor: Colors.neutral10,
                        }}
                      >
                        {AREA_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: spacing.xs,
                        marginTop: spacing.xs,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAreaOpen(false)
                          setCustomAreaError(null)
                        }}
                        style={{
                          borderRadius: radius.pill,
                          padding: `${spacing.xs}px ${spacing.md}px`,
                          border: `1px solid ${Colors.border}`,
                          backgroundColor: Colors.neutral10,
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
                {touched.area && errors.area && (
                  <p
                    style={{
                      marginTop: spacing.xs,
                      fontSize: fontSizes.xs,
                      color: Colors.error,
                    }}
                  >
                    {errors.area}
                  </p>
                )}
              </section>

              {/* Additional area */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.xs,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    color: Colors.text,
                  }}
                >
                  Additional Area (Sq/ft)
                </label>
                <input
                  type="text"
                  placeholder="E.g., 500"
                  value={formData.additionalArea}
                  onChange={(e) => handleInputChange("additionalArea", e.target.value)}
                  onBlur={handleFieldBlur("additionalArea")}
                  style={{
                    width: "100%",
                    borderRadius: radius.md,
                    border: `1px solid ${touched.additionalArea && errors.additionalArea ? Colors.error : Colors.border
                      }`,
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    fontSize: fontSizes.sm,
                  }}
                />
                {touched.additionalArea && errors.additionalArea && (
                  <p
                    style={{
                      marginTop: spacing.xs,
                      fontSize: fontSizes.xs,
                      color: Colors.error,
                    }}
                  >
                    {errors.additionalArea}
                  </p>
                )}
              </section>

              {/* Price / Price per marla / Installments */}
              {formData.listingType === "cash" &&
                (formData.propertyType === "plot" ||
                  formData.propertyType === "commercial plot") && (
                  <section>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.medium,
                        color: Colors.text,
                      }}
                    >
                      Price per marla
                    </label>
                    <input
                      type="text"
                      placeholder="250000"
                      value={formData.pricePerMarla}
                      onChange={(e) => handleInputChange("pricePerMarla", e.target.value)}
                      onBlur={handleFieldBlur("pricePerMarla")}
                      style={{
                        width: "100%",
                        borderRadius: radius.md,
                        border: `1px solid ${touched.pricePerMarla && errors.pricePerMarla ? Colors.error : Colors.border
                          }`,
                        padding: `${spacing.sm}px ${spacing.md}px`,
                        fontSize: fontSizes.sm,
                      }}
                    />
                    {touched.pricePerMarla && errors.pricePerMarla && (
                      <p
                        style={{
                          marginTop: spacing.xs,
                          fontSize: fontSizes.xs,
                          color: Colors.error,
                        }}
                      >
                        {errors.pricePerMarla}
                      </p>
                    )}
                  </section>
                )}

              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.xs,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    color: Colors.text,
                  }}
                >
                  {formData.propertyType === "plot" ||
                    formData.propertyType === "commercial plot"
                    ? "Total Price"
                    : "Price"}
                </label>
                <input
                  type="text"
                  placeholder="25000000"
                  value={
                    formData.propertyType === "plot" ||
                      formData.propertyType === "commercial plot"
                      ? formData.price
                      : formData.price
                  }
                  onChange={(e) => {
                    const isAutoCalculated =
                      (formData.propertyType === "plot" ||
                        formData.propertyType === "commercial plot") &&
                      formData.listingType === "cash" &&
                      formData.pricePerMarla &&
                      formData.area
                    if (!isAutoCalculated) {
                      handleInputChange("price", e.target.value)
                    }
                  }}
                  onBlur={handleFieldBlur("price")}
                  style={{
                    width: "100%",
                    borderRadius: radius.md,
                    border: `1px solid ${touched.price && errors.price ? Colors.error : Colors.border}`,
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    fontSize: fontSizes.sm,
                  }}
                  readOnly={
                    (formData.propertyType === "plot" ||
                      formData.propertyType === "commercial plot") &&
                    formData.listingType === "cash" &&
                    !!formData.pricePerMarla &&
                    !!formData.area
                  }
                />
                {touched.price && errors.price && (
                  <p
                    style={{
                      marginTop: spacing.xs,
                      fontSize: fontSizes.xs,
                      color: Colors.error,
                    }}
                  >
                    {errors.price}
                  </p>
                )}
              </section>

              {formData.listingType === "installments" && (
                <>
                  <section>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.medium,
                        color: Colors.text,
                      }}
                    >
                      Installment per month
                    </label>
                    <input
                      type="text"
                      placeholder="60000"
                      value={formData.installmentPerMonth}
                      onChange={(e) =>
                        handleInputChange("installmentPerMonth", e.target.value)
                      }
                      onBlur={handleFieldBlur("installmentPerMonth")}
                      style={{
                        width: "100%",
                        borderRadius: radius.md,
                        border: `1px solid ${touched.installmentPerMonth && errors.installmentPerMonth
                          ? Colors.error
                          : Colors.border
                          }`,
                        padding: `${spacing.sm}px ${spacing.md}px`,
                        fontSize: fontSizes.sm,
                      }}
                    />
                    {touched.installmentPerMonth && errors.installmentPerMonth && (
                      <p
                        style={{
                          marginTop: spacing.xs,
                          fontSize: fontSizes.xs,
                          color: Colors.error,
                        }}
                      >
                        {errors.installmentPerMonth}
                      </p>
                    )}
                  </section>
                  <section>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.medium,
                        color: Colors.text,
                      }}
                    >
                      Installment half yearly
                    </label>
                    <input
                      type="text"
                      placeholder="160000"
                      value={formData.installmentHalfYearly}
                      onChange={(e) =>
                        handleInputChange("installmentHalfYearly", e.target.value)
                      }
                      onBlur={handleFieldBlur("installmentHalfYearly")}
                      style={{
                        width: "100%",
                        borderRadius: radius.md,
                        border: `1px solid ${touched.installmentHalfYearly && errors.installmentHalfYearly
                          ? Colors.error
                          : Colors.border
                          }`,
                        padding: `${spacing.sm}px ${spacing.md}px`,
                        fontSize: fontSizes.sm,
                      }}
                    />
                    {touched.installmentHalfYearly && errors.installmentHalfYearly && (
                      <p
                        style={{
                          marginTop: spacing.xs,
                          fontSize: fontSizes.xs,
                          color: Colors.error,
                        }}
                      >
                        {errors.installmentHalfYearly}
                      </p>
                    )}
                  </section>
                </>
              )}

              {/* Description */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.xs,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    color: Colors.text,
                  }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Type a short description (optional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: radius.md,
                    border: `1px solid ${Colors.border}`,
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    fontSize: fontSizes.sm,
                    resize: "vertical",
                  }}
                />
              </section>

              {/* Possession */}
              <section>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.sm,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    color: Colors.text,
                  }}
                >
                  Possession
                </label>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.xs,
                      fontSize: fontSizes.sm,
                    }}
                  >
                    <input
                      type="radio"
                      name="possession"
                      checked={formData.possession === "Yes"}
                      onChange={() => handleInputChange("possession", "Yes")}
                    />
                    <span>Yes</span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.xs,
                      fontSize: fontSizes.sm,
                    }}
                  >
                    <input
                      type="radio"
                      name="possession"
                      checked={formData.possession === "No"}
                      onChange={() => handleInputChange("possession", "No")}
                    />
                    <span>No</span>
                  </label>
                </div>
                {touched.possession && errors.possession && (
                  <p
                    style={{
                      marginTop: spacing.xs,
                      fontSize: fontSizes.xs,
                      color: Colors.error,
                    }}
                  >
                    {errors.possession}
                  </p>
                )}
              </section>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: spacing.sm,
                  marginTop: spacing.sm,
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  style={{
                    borderRadius: radius.pill,
                    padding: `${spacing.md2}px ${spacing.lg}px`,
                    border: "none",
                    backgroundColor: isSubmitDisabled ? Colors.neutral60 : Colors.neutral100,
                    color: Colors.neutral10,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  style={{
                    borderRadius: radius.pill,
                    padding: `${spacing.md2}px ${spacing.lg}px`,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.neutral10,
                    color: Colors.text,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddListingPage


