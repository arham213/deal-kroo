import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { Text, View } from "react-native-web"
import type { AreaSize } from "@repo/utils/types/listings"
import type { User } from "@repo/utils/types/auth"
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
import { useToast } from "./common/ToastContext"
import { TextField } from "./TextField"

type AddListingModalProps = {
    isOpen: boolean
    onClose: () => void
    user: User | null
    token: string | null
    onSuccess?: () => void
}

const AREA_TYPE_OPTIONS = ["Marla", "Kanal"] as const
const PRESET_AREA_SIZES: AreaSize[] = ["3 Marla", "5 Marla", "10 Marla", "15 Marla", "1 Kanal"]

const PHASE_OPTIONS = ["Phase 2"] as const

const RESEDENTIAL_BLOCKS = [
    "A block", "A-ext block", "B block", "C block", "C-ext block", "D block", "D-ext block",
    "E block", "F block", "G block", "H block", "I block", "J block", "J-ext block", "J-1 block",
    "K block", "L block", "M block", "N block", "N-ext block", "O block", "P block", "Q block",
    "Q-ext block", "R block", "R-ext block", "Overseas Zone 1", "Overseas Zone 2", "Overseas Zone 3",
    "Overseas Zone 4", "Overseas Zone 5",
] as const

const COMMERCIAL_BLOCKS = [
    "A block Market", "A2 Commercial", "B block market", "C block market", "C2 commercial",
    "D block commercial", "F block commercial", "F block D-shape commercial", "I block commercial",
    "J block commercial", "J-1 block commercial", "L block commercial", "L block D-shape commercial",
    "M block commercial", "N block commercial", "N-ext block commercial", "O block commercial",
    "P commercial zone", "P commercial shop", "R commercial", "R1 commercial", "R2 commercial",
    "R-ext commercial", "Hassan Commercial", "Joyland", "Overseas commercial zone 1",
    "Overseas commercial zone 2", "Overseas commercial zone 3", "Overseas commercial zone 4",
    "Overseas commercial zone 5",
] as const

export default function AddListingModal({
    isOpen,
    onClose,
    user,
    token,
    onSuccess,
}: AddListingModalProps) {
    const router = useRouter()
    const { showSuccessToast, showErrorToast } = useToast()
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

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData(createInitialAddListingState())
            setErrors({})
            setTouched(createAddListingTouchedState(false))
            setCustomAreaOpen(false)
            setCustomAreaValue("")
            setCustomAreaType("Marla")
            setCustomAreaError(null)
        }
    }, [isOpen])

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

    // Auto-calc total price
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
                updateForm((prev) => ({ ...prev, price: calculatedPrice }))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.pricePerMarla, formData.area, formData.additionalArea, formData.propertyType, formData.listingType])

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

        updateForm((prev) => ({ ...prev, [key]: value }))

        if (
            typeof value === "string" &&
            isValidatableListingField(key) &&
            (options?.forceValidate || touched[key as ListingField])
        ) {
            const nextState = { ...formData, [key]: value } as AddListingState
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
        setTouched((prev) => ({ ...prev, [field]: true }))
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
            showErrorToast("You must be logged in to add a listing")
            return
        }

        setLoading(true)
        try {
            const payload = buildAddListingPayload(formData, user)
            await createListing({ token, payload })
            showSuccessToast("Listing added successfully")
            onSuccess?.()
            onClose()
            router.push("/my-listings")
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Something went wrong. Please try again later"
            showErrorToast(message)
        } finally {
            setLoading(false)
        }
    }

    const allAreaSizes: AreaSize[] = [...PRESET_AREA_SIZES, "custom" as AreaSize]

    const handleAreaSelect = (size: AreaSize) => {
        setTouched((prev) => ({ ...prev, area: true }))
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
        setTouched((prev) => ({ ...prev, area: true }))
        handleInputChange("area", customArea, { forceValidate: true })
        setCustomAreaError(null)
        setCustomAreaOpen(false)
        setCustomAreaValue("")
        setCustomAreaType("Marla")
    }

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

    const errorInputStyle = {
        ...inputStyle,
        borderColor: Colors.error,
    }

    const selectStyle = {
        ...inputStyle,
        appearance: "none" as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
        paddingRight: spacing.xxl,
    }

    return (
        <>
            <style>{`
        .add-listing-modal-overlay {
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
        .add-listing-modal-content {
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: ${Colors.neutral10};
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .add-listing-modal-content::-webkit-scrollbar {
          display: none;
        }
        .add-listing-modal-content input::placeholder,
        .add-listing-modal-content textarea::placeholder,
        .add-listing-modal-content select option:disabled {
          color: #666 !important;
        }
        @media (max-width: 640px) {
          .add-listing-modal-overlay {
            padding: 16px;
          }
          .add-listing-modal-content {
            padding: 24px;
            border-radius: 16px;
          }
        }
      `}</style>
            <div className="add-listing-modal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}>
                <div className="add-listing-modal-content" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: spacing.md,
                        gap: spacing.md,
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: fontSizes.xl,
                                fontWeight: fontWeights.semibold,
                                color: Colors.text,
                                marginBottom: spacing.xs,
                            }}>
                                Add Listing
                            </h1>
                            <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary, margin: 0 }}>
                                Create a new property listing with price, area, and installment options.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                backgroundColor: Colors.neutral10,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                            aria-label="Close"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M1 13L13 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
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
                            <div style={{
                                display: "flex",
                                gap: spacing.xl,
                                borderBottom: `1px solid ${Colors.border}`,
                            }}>
                                {["plot", "house", "commercial plot"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleInputChange("propertyType", type)}
                                        style={{
                                            border: "none",
                                            borderBottom: formData.propertyType === type ? `2px solid ${Colors.neutral100}` : "2px solid transparent",
                                            padding: `${spacing.sm}px 0`,
                                            marginBottom: -1,
                                            fontSize: fontSizes.sm,
                                            cursor: "pointer",
                                            backgroundColor: "transparent",
                                            color: formData.propertyType === type ? Colors.text : Colors.textSecondary,
                                            fontWeight: formData.propertyType === type ? fontWeights.semibold : fontWeights.medium,
                                        }}
                                    >
                                        {type === "plot" ? "Plot" : type === "house" ? "House" : "Commercial plot"}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Listing type (Cash / Installments) */}
                        {formData.propertyType !== "house" && (
                            <section>
                                <label style={{
                                    display: "block",
                                    marginBottom: spacing.sm,
                                    fontSize: fontSizes.sm,
                                    fontWeight: fontWeights.semibold,
                                    color: Colors.text,
                                }}>
                                    What is it for?
                                </label>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                        {(formData.propertyType === "plot" || formData.propertyType === "commercial plot") && (
                            <View>
                                <TextField
                                    label="Plot No"
                                    placeholder="Eg., 101"
                                    value={formData.plotNo}
                                    onChangeText={(text) => handleInputChange("plotNo", text)}
                                    onBlur={handleFieldBlur("plotNo")}
                                    error={touched.plotNo ? errors.plotNo : undefined}
                                />
                            </View>
                        )}

                        {formData.propertyType === "house" && (
                            <View>
                                <TextField
                                    label="House No"
                                    placeholder="Eg., 101"
                                    value={formData.houseNo}
                                    onChangeText={(text) => handleInputChange("houseNo", text)}
                                    onBlur={handleFieldBlur("houseNo")}
                                    error={touched.houseNo ? errors.houseNo : undefined}
                                />
                            </View>
                        )}

                        {/* Phase */}
                        <section>
                            <label style={{
                                display: "block",
                                marginBottom: spacing.xs,
                                fontSize: fontSizes.sm,
                                fontWeight: fontWeights.medium,
                                color: Colors.text,
                            }}>
                                Phase
                            </label>
                            <select
                                value={formData.phase}
                                onChange={(e) => handleInputChange("phase", e.target.value, { forceValidate: true })}
                                onBlur={handleFieldBlur("phase")}
                                style={touched.phase && errors.phase ? errorInputStyle : selectStyle}
                            >
                                <option value="" disabled style={{ color: "#666" }}>Select Phase</option>
                                {PHASE_OPTIONS.map((phase) => (
                                    <option key={phase} value={phase}>{phase}</option>
                                ))}
                            </select>
                            {touched.phase && errors.phase && (
                                <Text style={{ marginTop: spacing.xs, fontSize: fontSizes.xs, color: Colors.error }}>
                                    {errors.phase}
                                </Text>
                            )}
                        </section>

                        {/* Block */}
                        <section>
                            <label style={{
                                display: "block",
                                marginBottom: spacing.xs,
                                fontSize: fontSizes.sm,
                                fontWeight: fontWeights.medium,
                                color: Colors.text,
                            }}>
                                Block
                            </label>
                            <select
                                value={formData.block}
                                onChange={(e) => handleInputChange("block", e.target.value, { forceValidate: true })}
                                onBlur={handleFieldBlur("block")}
                                style={touched.block && errors.block ? errorInputStyle : selectStyle}
                            >
                                <option value="" disabled style={{ color: "#666" }}>Select Block</option>
                                {(formData.propertyType === "commercial plot"
                                    ? COMMERCIAL_BLOCKS
                                    : RESEDENTIAL_BLOCKS
                                ).map((block) => (
                                    <option key={block} value={block}>{block}</option>
                                ))}
                            </select>
                            {touched.block && errors.block && (
                                <Text style={{ marginTop: spacing.xs, fontSize: fontSizes.xs, color: Colors.error }}>
                                    {errors.block}
                                </Text>
                            )}
                        </section>

                        {/* Area */}
                        <section>
                            <label style={{
                                display: "block",
                                marginBottom: spacing.sm,
                                fontSize: fontSizes.sm,
                                fontWeight: fontWeights.semibold,
                                color: Colors.text,
                            }}>
                                Area
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.xs }}>
                                {allAreaSizes.map((size) => {
                                    const isCustomValue = !allAreaSizes.includes(formData.area as AreaSize)
                                    const isActive = customAreaOpen
                                        ? size === "custom"
                                        : size === "custom"
                                            ? isCustomValue
                                            : formData.area === size
                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleAreaSelect(size)}
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
                                            {size === "custom" ? "Custom" : size}
                                        </button>
                                    )
                                })}
                            </div>
                            {customAreaOpen && (
                                <div style={{
                                    marginTop: spacing.sm,
                                    padding: spacing.md,
                                    borderRadius: radius.lg,
                                    border: `1px solid ${Colors.border}`,
                                    backgroundColor: Colors.neutral10,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: spacing.sm,
                                    alignItems: "flex-end",
                                }}>
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <label style={{
                                            display: "block",
                                            marginBottom: spacing.xs,
                                            fontSize: fontSizes.xs,
                                            fontWeight: fontWeights.medium,
                                            color: Colors.text,
                                        }}>
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
                                            style={customAreaError ? errorInputStyle : inputStyle}
                                        />
                                        {customAreaError && (
                                            <p style={{ marginTop: spacing.xs, fontSize: fontSizes.xs, color: Colors.error }}>
                                                {customAreaError}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ minWidth: 100 }}>
                                        <label style={{
                                            display: "block",
                                            marginBottom: spacing.xs,
                                            fontSize: fontSizes.xs,
                                            fontWeight: fontWeights.medium,
                                            color: Colors.text,
                                        }}>
                                            Type
                                        </label>
                                        <select
                                            value={customAreaType}
                                            onChange={(e) => setCustomAreaType(e.target.value as typeof customAreaType)}
                                            style={selectStyle}
                                        >
                                            {AREA_TYPE_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", gap: spacing.xs }}>
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
                                <Text style={{ marginTop: spacing.xs, fontSize: fontSizes.xs, color: Colors.error }}>
                                    {errors.area}
                                </Text>
                            )}
                        </section>

                        {/* Additional area */}
                        <View>
                            <TextField
                                label="Additional Area (Sq/ft)"
                                placeholder="Optional, e.g. 50"
                                value={formData.additionalArea}
                                onChangeText={(text) => handleInputChange("additionalArea", text)}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Price Per Marla (for cash plot) */}
                        {(formData.propertyType === "plot" || formData.propertyType === "commercial plot") &&
                            formData.listingType === "cash" && (
                                <View>
                                    <TextField
                                        label="Price Per Marla"
                                        placeholder="e.g. 5000000"
                                        value={formData.pricePerMarla}
                                        onChangeText={(text) => handleInputChange("pricePerMarla", text)}
                                        onBlur={handleFieldBlur("pricePerMarla")}
                                        keyboardType="numeric"
                                        error={touched.pricePerMarla ? errors.pricePerMarla : undefined}
                                    />
                                </View>
                            )}

                        {/* Total Price (display for cash - auto-calculated) */}
                        {(formData.propertyType === "plot" || formData.propertyType === "commercial plot") &&
                            formData.listingType === "cash" && (
                                <section>
                                    <label style={{
                                        display: "block",
                                        marginBottom: spacing.xs,
                                        fontSize: fontSizes.sm,
                                        fontWeight: fontWeights.medium,
                                        color: Colors.text,
                                    }}>
                                        Total Price
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.price ? `Rs. ${Number(formData.price).toLocaleString()}` : ""}
                                        readOnly
                                        placeholder="Auto-calculated from price per marla × area"
                                        style={{
                                            ...inputStyle,
                                            backgroundColor: "#f5f5f5",
                                            cursor: "default",
                                            color: Colors.text,
                                        }}
                                    />
                                </section>
                            )}

                        {/* House price */}
                        {formData.propertyType === "house" && (
                            <View>
                                <TextField
                                    label="Price"
                                    placeholder="e.g. 20000000"
                                    value={formData.price}
                                    onChangeText={(text) => handleInputChange("price", text)}
                                    onBlur={handleFieldBlur("price")}
                                    keyboardType="numeric"
                                    error={touched.price ? errors.price : undefined}
                                />
                            </View>
                        )}

                        {/* Installment fields */}
                        {formData.listingType === "installments" && (
                            <>
                                <View>
                                    <TextField
                                        label="Installment Per Month"
                                        placeholder="e.g. 50000"
                                        value={formData.installmentPerMonth}
                                        onChangeText={(text) => handleInputChange("installmentPerMonth", text)}
                                        onBlur={handleFieldBlur("installmentPerMonth")}
                                        keyboardType="numeric"
                                        error={touched.installmentPerMonth ? errors.installmentPerMonth : undefined}
                                    />
                                </View>
                                <View>
                                    <TextField
                                        label="Half Yearly Installment"
                                        placeholder="e.g. 200000"
                                        value={formData.installmentHalfYearly}
                                        onChangeText={(text) => handleInputChange("installmentHalfYearly", text)}
                                        onBlur={handleFieldBlur("installmentHalfYearly")}
                                        keyboardType="numeric"
                                        error={touched.installmentHalfYearly ? errors.installmentHalfYearly : undefined}
                                    />
                                </View>
                            </>
                        )}

                        {/* Description */}
                        <section>
                            <label style={{
                                display: "block",
                                marginBottom: spacing.xs,
                                fontSize: fontSizes.sm,
                                fontWeight: fontWeights.medium,
                                color: Colors.text,
                            }}>
                                Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Type a short description (optional)"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                style={{
                                    ...inputStyle,
                                    borderRadius: radius.lg,
                                    resize: "vertical",
                                    minHeight: 80,
                                }}
                            />
                        </section>

                        {/* Possession */}
                        <section>
                            <label style={{
                                display: "block",
                                marginBottom: spacing.sm,
                                fontSize: fontSizes.sm,
                                fontWeight: fontWeights.medium,
                                color: Colors.text,
                            }}>
                                Possession
                            </label>
                            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                {["Yes", "No"].map((option) => (
                                    <label
                                        key={option}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: spacing.xs,
                                            fontSize: fontSizes.sm,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="possession"
                                            checked={formData.possession === option}
                                            onChange={() => handleInputChange("possession", option)}
                                            style={{
                                                accentColor: Colors.neutral100,
                                                width: 18,
                                                height: 18,
                                                cursor: "pointer",
                                            }}
                                        />
                                        <span style={{ color: Colors.text, fontWeight: fontWeights.medium }}>{option}</span>
                                    </label>
                                ))}
                            </div>
                            {touched.possession && errors.possession && (
                                <Text style={{ marginTop: spacing.xs, fontSize: fontSizes.xs, color: Colors.error }}>
                                    {errors.possession}
                                </Text>
                            )}
                        </section>

                        {/* Actions */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: spacing.sm,
                            marginTop: spacing.md,
                        }}>
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                style={{
                                    borderRadius: radius.pill,
                                    padding: `${spacing.sm2}px ${spacing.lg}px`,
                                    border: "none",
                                    backgroundColor: isSubmitDisabled ? Colors.neutral60 : Colors.neutral100,
                                    color: Colors.neutral10,
                                    fontSize: fontSizes.xs,
                                    fontWeight: fontWeights.regular,
                                    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? "Adding..." : "Add Listing"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    borderRadius: radius.pill,
                                    padding: `${spacing.sm2}px ${spacing.lg}px`,
                                    border: `1px solid ${Colors.border}`,
                                    backgroundColor: Colors.neutral10,
                                    color: Colors.text,
                                    fontSize: fontSizes.xs,
                                    fontWeight: fontWeights.regular,
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
