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
import { useToast } from "../components/common/ToastContext"
import { LoggedInHeader } from "../components/common/LoggedInHeader"

const BASE_URL = "https://api.dealkroo.com/api"

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
  const { showSuccessToast, showErrorToast } = useToast()

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
        showSuccessToast("Profile updated successfully!")
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
        showErrorToast(response.data?.message || "Failed to update profile")
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
        showErrorToast("Something went wrong. Please try again later")
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
      showSuccessToast("Logged out successfully")
      router.replace("/auth/sign-in")
    } catch {
      setGlobalError("Failed to logout. Please try again.")
      showErrorToast("Failed to logout. Please try again.")
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
        showSuccessToast("Account deleted successfully!")
        await logout()
        router.replace("/auth/sign-in")
      } else {
        setGlobalError(response.data?.message || "Failed to delete account")
        showErrorToast(response.data?.message || "Failed to delete account")
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
        showErrorToast("Something went wrong. Please try again later")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <>
      <style>{`
        .profile-input::placeholder {
          color: ${Colors.placeholder};
        }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: Colors.neutral10,
        }}
      >
        {/* Header */}
        <LoggedInHeader />

        {/* Main Content */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: `${spacing.xxxl}px ${spacing.xl}px`,
          }}
        >
          {/* Page Title */}
          <h1
            style={{
              fontSize: fontSizes.xl,
              fontWeight: fontWeights.semibold,
              color: Colors.text,
              marginBottom: spacing.xxl,
            }}
          >
            My Profile
          </h1>

          {/* Profile Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSave()
            }}
          >
            <style>{`
              .profile-form-container {
                display: flex;
                gap: 70px;
                align-items: flex-start;
              }
              .profile-form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
              }
              .profile-field-half {
                max-width: calc(50% - 10px);
              }
              @media (max-width: 768px) {
                .profile-form-container {
                  flex-direction: column;
                  gap: 24px;
                  align-items: center;
                }
                .profile-form-grid {
                  grid-template-columns: 1fr;
                }
                .profile-field-half {
                  max-width: 100%;
                }
              }
            `}</style>
            <div className="profile-form-container">
              {/* Avatar Section */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: Colors.neutral30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: fontSizes.xxl,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              {/* Form Fields */}
              <div style={{ flex: 1, width: "100%" }}>
                {/* Row 1: Full Name + Contact Number */}
                <div className="profile-form-grid" style={{ marginBottom: spacing.lg }}>
                  {/* Full Name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.regular,
                        color: Colors.text,
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="profile-input"
                      placeholder="Enter your full name"
                      value={editData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      onBlur={handleBlur("name")}
                      disabled={loading || isLoggingOut}
                      style={{
                        width: "100%",
                        borderRadius: radius.pill,
                        border: `1px solid ${touched.name && errors.name ? Colors.error : Colors.border}`,
                        padding: `${spacing.sm}px ${spacing.lg}px`,
                        fontSize: fontSizes.sm,
                        backgroundColor: Colors.inputBackground,
                        color: Colors.text,
                        outline: "none",
                        fontFamily: "inherit",
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

                  {/* Email */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.regular,
                        color: Colors.text,
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="profile-input"
                      placeholder="Enter your email"
                      value={editData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={handleBlur("email")}
                      disabled={loading || isLoggingOut}
                      style={{
                        width: "100%",
                        borderRadius: radius.pill,
                        border: `1px solid ${touched.email && errors.email ? Colors.error : Colors.border}`,
                        padding: `${spacing.sm}px ${spacing.lg}px`,
                        fontSize: fontSizes.sm,
                        backgroundColor: Colors.inputBackground,
                        color: Colors.text,
                        outline: "none",
                        fontFamily: "inherit",
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

                {/* Row 2: Contact Number + Estate Name */}
                <div className="profile-form-grid">
                  {/* Contact Number */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.regular,
                        color: Colors.text,
                      }}
                    >
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      className="profile-input"
                      placeholder="+92  300 xxxx xxx"
                      value={editData.contactNo}
                      maxLength={11}
                      onChange={(e) => handleInputChange("contactNo", e.target.value)}
                      onBlur={handleBlur("contactNo")}
                      disabled={loading || isLoggingOut}
                      style={{
                        width: "100%",
                        borderRadius: radius.pill,
                        border: `1px solid ${touched.contactNo && errors.contactNo ? Colors.error : Colors.border}`,
                        padding: `${spacing.sm}px ${spacing.lg}px`,
                        fontSize: fontSizes.sm,
                        backgroundColor: Colors.inputBackground,
                        color: Colors.text,
                        outline: "none",
                        fontFamily: "inherit",
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

                  {/* Estate Name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: spacing.xs,
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.regular,
                        color: Colors.text,
                      }}
                    >
                      Estate Name
                    </label>
                    <input
                      type="text"
                      className="profile-input"
                      placeholder="Enter your estate name"
                      value={editData.estateName}
                      onChange={(e) => handleInputChange("estateName", e.target.value)}
                      onBlur={handleBlur("estateName")}
                      disabled={loading || isLoggingOut}
                      style={{
                        width: "100%",
                        borderRadius: radius.pill,
                        border: `1px solid ${touched.estateName && errors.estateName ? Colors.error : Colors.border}`,
                        padding: `${spacing.sm}px ${spacing.lg}px`,
                        fontSize: fontSizes.sm,
                        backgroundColor: Colors.inputBackground,
                        color: Colors.text,
                        outline: "none",
                        fontFamily: "inherit",
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
                </div>
              </div>
            </div>

            {/* Action Buttons - right aligned */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: spacing.md,
                marginTop: spacing.xxxl,
              }}
            >
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                style={{
                  borderRadius: radius.pill,
                  padding: `${spacing.sm}px ${spacing.xl}px`,
                  border: `1px solid ${Colors.error}`,
                  backgroundColor: "transparent",
                  color: Colors.error,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.regular,
                  cursor: "pointer",
                }}
              >
                Delete Account
              </button>
              <button
                type="submit"
                disabled={isUpdateDisabled}
                style={{
                  borderRadius: radius.pill,
                  padding: `${spacing.sm}px ${spacing.xl}px`,
                  border: "none",
                  backgroundColor: isUpdateDisabled ? Colors.neutral60 : Colors.neutral100,
                  color: Colors.neutral10,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.regular,
                  cursor: isUpdateDisabled ? "not-allowed" : "pointer",
                  opacity: isUpdateDisabled ? 0.5 : 1,
                }}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 24,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) setShowDeleteModal(false)
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                backgroundColor: Colors.neutral10,
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: fontSizes.xl,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                  marginBottom: spacing.md,
                  textAlign: "center",
                }}
              >
                Delete Account
              </h2>
              <p
                style={{
                  fontSize: fontSizes.sm,
                  color: Colors.textSecondary,
                  marginBottom: spacing.xl,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Are you sure you want to delete your account? This will permanently remove your listings and profile data.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.sm,
                }}
              >
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  style={{
                    width: "100%",
                    borderRadius: radius.pill,
                    padding: `${spacing.md}px ${spacing.lg}px`,
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
                    width: "100%",
                    borderRadius: radius.pill,
                    padding: `${spacing.md}px ${spacing.lg}px`,
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
    </>
  )
}

export default ProfilePage