import { useEffect, useMemo, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import axios from "axios"
import type { User } from "@repo/utils/types/auth"
import {
  buildProfileUpdatePayload,
  hasProfileChanges,
  validateProfileField,
  validateProfileForm,
  type EditableProfileField,
  type ProfileErrors,
} from "@repo/utils/auth/profile"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { Validation } from "@repo/utils/validation"
import { useAuthContext } from "../contexts/AuthContext"

const BASE_URL = "https://deal-karo-backend.vercel.app/api"

const emptyUser: User = {
  _id: "",
  name: "",
  email: "",
  contactNo: "",
  estateName: "",
  verificationStatus: "pending",
  role: "dealer",
  createdAt: "",
  updatedAt: "",
}

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, logout, setUser } = useAuthContext()

  const [profile, setProfile] = useState<User>(user ?? emptyUser)
  const [editData, setEditData] = useState<User>(user ?? emptyUser)
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [touched, setTouched] = useState<Record<EditableProfileField, boolean>>({
    name: false,
    email: false,
    contactNo: false,
    estateName: false,
  })
  const [loading, setLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null)

  // Keep local state in sync when AuthContext user changes
  useEffect(() => {
    if (user) {
      setProfile(user)
      setEditData(user)
    }
  }, [user])

  // Redirect unauthenticated users to sign-in once auth check completes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/sign-in")
    }
  }, [isLoading, isAuthenticated, router])

  const hasChanges = useMemo(
    () => hasProfileChanges(profile, editData),
    [editData, profile],
  )

  const initials = useMemo(() => {
    const sourceName = editData.name || user?.name || ""
    if (!sourceName.trim()) return "DK"
    return sourceName
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [editData.name, user?.name])

  const markAllTouched = () => {
    setTouched({
      name: true,
      email: true,
      contactNo: true,
      estateName: true,
    })
  }

  const handleInputChange = (key: EditableProfileField, value: string) => {
    setGlobalError(null)
    setGlobalSuccess(null)

    if (key === "contactNo") {
      const digits = Validation.digitsOnly(value).slice(0, 11)
      setEditData((prev) => ({
        ...prev,
        contactNo: digits,
      }))

      if (!touched.contactNo) {
        setTouched((prev) => ({ ...prev, contactNo: true }))
      }

      const errorMessage = validateProfileField("contactNo", digits)
      setErrors((prev) => {
        const next = { ...prev }
        if (errorMessage) next.contactNo = errorMessage
        else delete next.contactNo
        return next
      })
      return
    }

    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }))

    if (touched[key]) {
      const errorMessage = validateProfileField(key, value)
      setErrors((prev) => {
        const next = { ...prev }
        if (errorMessage) next[key] = errorMessage
        else delete next[key]
        return next
      })
    }
  }

  const handleBlur = (field: EditableProfileField) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    const value = editData[field] ?? ""
    const errorMessage = validateProfileField(field, value)
    setErrors((prev) => {
      const next = { ...prev }
      if (errorMessage) next[field] = errorMessage
      else delete next[field]
      return next
    })
  }

  const editableErrors = useMemo(
    () =>
      (["name", "email", "contactNo", "estateName"] as EditableProfileField[]).some((field) =>
        Boolean(validateProfileField(field, editData[field] ?? "")),
      ),
    [editData],
  )

  const isUpdateDisabled = !hasChanges || editableErrors || loading

  const handleSave = async () => {
    setGlobalError(null)
    setGlobalSuccess(null)

    const { isValid, errors: validationErrors } = validateProfileForm(editData)
    setErrors(validationErrors)
    if (!isValid) {
      markAllTouched()
      return
    }

    if (!token) {
      await logout()
      router.replace("/auth/sign-in")
      return
    }

    setLoading(true)
    try {
      const updateData = buildProfileUpdatePayload(profile, editData)

      const response = await axios.put(
        `${BASE_URL}/users/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data?.success) {
        const updatedUser: User =
          response.data.data?.user ?? {
            ...editData,
            contactNo: Validation.digitsOnly(editData.contactNo || ""),
          }

        setProfile(updatedUser)
        await setUser(updatedUser)

        setErrors({})
        setTouched({
          name: false,
          email: false,
          contactNo: false,
          estateName: false,
        })

        setGlobalSuccess("Profile updated successfully!")
      } else {
        setEditData(profile)
        setErrors({})
        setTouched({
          name: false,
          email: false,
          contactNo: false,
          estateName: false,
        })
        setGlobalError(response.data?.message || "Failed to update profile")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout()
        router.replace("/auth/sign-in")
        return
      }

      setEditData(profile)
      setErrors({})
      setTouched({
        name: false,
        email: false,
        contactNo: false,
        estateName: false,
      })

      if (axios.isAxiosError(error)) {
        setGlobalError(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Failed to update profile. Please try again.",
        )
      } else {
        setGlobalError("Something went wrong. Please try again later")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setGlobalError(null)
    setGlobalSuccess(null)

    try {
      setIsLoggingOut(true)
      await logout()
      router.replace("/auth/sign-in")
    } catch {
      setGlobalError("Failed to logout. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleDeleteAccount = async () => {
    setGlobalError(null)
    setGlobalSuccess(null)

    if (!token) {
      await logout()
      router.replace("/auth/sign-in")
      return
    }

    try {
      setIsDeleting(true)

      const response = await axios.delete(`${BASE_URL}/users/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data?.success) {
        setShowDeleteModal(false)
        setGlobalSuccess("Account deleted successfully!")
        await logout()
        router.replace("/auth/sign-in")
      } else {
        setGlobalError(response.data?.message || "Failed to delete account")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setShowDeleteModal(false)
        await logout()
        router.replace("/auth/sign-in")
        return
      }

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to delete account. Please try again."
        setGlobalError(message)
      } else {
        setGlobalError("Something went wrong. Please try again later")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return null
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
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.lg,
            gap: spacing.md,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.pill,
                backgroundColor: Colors.neutral30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSizes.md,
                fontWeight: fontWeights.semibold,
                color: Colors.text,
              }}
            >
              {initials}
            </div>
            <div>
              <h1
                style={{
                  fontSize: fontSizes.xl,
                  fontWeight: fontWeights.bold,
                  color: Colors.text,
                  marginBottom: spacing.xs,
                }}
              >
                My Profile
              </h1>
              <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                Update your personal details and manage your account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
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
            Delete Account
          </button>
        </header>

        {/* Status messages */}
        {globalError && (
          <div
            style={{
              marginBottom: spacing.md,
              padding: spacing.sm,
              borderRadius: radius.md,
              backgroundColor: Colors.backgroundCash,
              color: Colors.textCash,
              fontSize: fontSizes.sm,
            }}
          >
            {globalError}
          </div>
        )}
        {globalSuccess && (
          <div
            style={{
              marginBottom: spacing.md,
              padding: spacing.sm,
              borderRadius: radius.md,
              backgroundColor: "#ECFDF5",
              color: Colors.success2,
              fontSize: fontSizes.sm,
            }}
          >
            {globalSuccess}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSave()
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.lg,
          }}
        >
          {/* Form fields - two column layout to match Figma */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
              columnGap: spacing.xl,
              rowGap: spacing.lg,
            }}
          >
            {/* Full Name */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: spacing.xs,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={editData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={handleBlur("name")}
                disabled={loading || isLoggingOut}
                style={{
                  width: "100%",
                  borderRadius: radius.pill,
                  border: `1px solid ${touched.name && errors.name ? Colors.error : Colors.border}`,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  fontSize: fontSizes.sm,
                  backgroundColor: Colors.neutral10,
                }}
              />
              {touched.name && errors.name && (
                <p
                  style={{
                    marginTop: spacing.xs,
                    fontSize: fontSizes.xs,
                    color: Colors.error,
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: spacing.xs,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                }}
              >
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="Enter your contact number"
                value={editData.contactNo}
                maxLength={11}
                onChange={(e) => handleInputChange("contactNo", e.target.value)}
                onBlur={handleBlur("contactNo")}
                disabled={loading || isLoggingOut}
                style={{
                  width: "100%",
                  borderRadius: radius.pill,
                  border: `1px solid ${
                    touched.contactNo && errors.contactNo ? Colors.error : Colors.border
                  }`,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  fontSize: fontSizes.sm,
                  backgroundColor: Colors.neutral10,
                }}
              />
              {touched.contactNo && errors.contactNo && (
                <p
                  style={{
                    marginTop: spacing.xs,
                    fontSize: fontSizes.xs,
                    color: Colors.error,
                  }}
                >
                  {errors.contactNo}
                </p>
              )}
            </div>

            {/* Estate Name (full width row) */}
            <div style={{ gridColumn: "1 / span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: spacing.xs,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                }}
              >
                Estate Name
              </label>
              <input
                type="text"
                placeholder="Enter your estate name"
                value={editData.estateName}
                onChange={(e) => handleInputChange("estateName", e.target.value)}
                onBlur={handleBlur("estateName")}
                disabled={loading || isLoggingOut}
                style={{
                  width: "100%",
                  borderRadius: radius.pill,
                  border: `1px solid ${
                    touched.estateName && errors.estateName ? Colors.error : Colors.border
                  }`,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  fontSize: fontSizes.sm,
                  backgroundColor: Colors.neutral10,
                }}
              />
              {touched.estateName && errors.estateName && (
                <p
                  style={{
                    marginTop: spacing.xs,
                    fontSize: fontSizes.xs,
                    color: Colors.error,
                  }}
                >
                  {errors.estateName}
                </p>
              )}
            </div>

            {/* Email (kept for completeness, right column under estate on larger screens) */}
            <div style={{ gridColumn: "1 / span 2", maxWidth: 420 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: spacing.xs,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: Colors.text,
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={editData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={handleBlur("email")}
                disabled={loading || isLoggingOut}
                style={{
                  width: "100%",
                  borderRadius: radius.pill,
                  border: `1px solid ${touched.email && errors.email ? Colors.error : Colors.border}`,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  fontSize: fontSizes.sm,
                  backgroundColor: Colors.neutral10,
                }}
              />
              {touched.email && errors.email && (
                <p
                  style={{
                    marginTop: spacing.xs,
                    fontSize: fontSizes.xs,
                    color: Colors.error,
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: spacing.lg,
              gap: spacing.sm,
            }}
          >
            {hasChanges && (
              <button
                type="submit"
                disabled={isUpdateDisabled}
                style={{
                  borderRadius: radius.pill,
                  padding: `${spacing.sm}px ${spacing.lg * 1.2}px`,
                  border: "none",
                  backgroundColor: isUpdateDisabled ? Colors.neutral60 : Colors.neutral100,
                  color: Colors.neutral10,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  cursor: isUpdateDisabled ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading || isLoggingOut}
              style={{
                borderRadius: radius.pill,
                padding: `${spacing.sm}px ${spacing.lg}px`,
                border: "none",
                backgroundColor: Colors.error,
                color: Colors.neutral10,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.semibold,
                cursor: loading || isLoggingOut ? "not-allowed" : "pointer",
                opacity: loading || isLoggingOut ? 0.7 : 1,
              }}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </form>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                backgroundColor: Colors.neutral10,
                borderRadius: radius.xxl,
                padding: spacing.lg,
                boxShadow: "0 12px 40px rgba(15,23,42,0.35)",
              }}
            >
              <h2
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.bold,
                  color: Colors.text,
                  marginBottom: spacing.sm,
                  textAlign: "center",
                }}
              >
                Delete Account
              </h2>
              <p
                style={{
                  fontSize: fontSizes.sm,
                  color: Colors.textSecondary,
                  marginBottom: spacing.md,
                  textAlign: "center",
                }}
              >
                Are you sure you want to delete your account? This will permanently remove your
                listings and profile data.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.xs,
                  marginTop: spacing.sm,
                }}
              >
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  style={{
                    borderRadius: radius.pill,
                    padding: `${spacing.md2}px ${spacing.lg}px`,
                    border: "none",
                    backgroundColor: Colors.error,
                    color: Colors.neutral10,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  style={{
                    borderRadius: radius.pill,
                    padding: `${spacing.md2}px ${spacing.lg}px`,
                    border: `1px solid ${Colors.border}`,
                    backgroundColor: Colors.neutral10,
                    color: Colors.text,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.medium,
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage


