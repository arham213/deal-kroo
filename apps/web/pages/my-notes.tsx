import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import {
  NOTE_MAX_LENGTH,
  formatNoteDate,
  validateNoteDescription,
  type Note,
} from "@repo/utils/notes/notes"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../contexts/AuthContext"

const BASE_URL = "https://deal-karo-backend.vercel.app/api"
const PAGE_SIZE = parseInt(process.env.PAGINATION_LIMIT || "25", 10)

const MyNotesPage: NextPage = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, logout } = useAuthContext()

  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newNoteDescription, setNewNoteDescription] = useState("")
  const [noteError, setNoteError] = useState<string | undefined>(undefined)
  const [noteTouched, setNoteTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isVerified = user?.verificationStatus === "verified"

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  )

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
            Your account must be verified by an admin to access your notes. Please wait for
            verification or contact support.
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

  const fetchNotes = useCallback(
    async (page: number, authToken?: string | null) => {
      setLoading(true)
      setError(null)

      try {
        const effectiveToken = authToken ?? token

        if (!effectiveToken) {
          await logout()
          router.replace("/auth/sign-in")
          return
        }

        const response = await axios.get(`${BASE_URL}/notes`, {
          params: {
            page,
            limit: PAGE_SIZE,
          },
          headers: {
            Authorization: `Bearer ${effectiveToken}`,
          },
        })

        if (response?.data?.success) {
          const data = response.data.data
          let fetchedNotes: Note[] = []
          let pagination: { page?: number; totalPages?: number } | null = null

          if (Array.isArray(data)) {
            fetchedNotes = data
          } else if (data && typeof data === "object") {
            fetchedNotes = data.notes || []
            pagination = data.pagination || null
          }

          setNotes(fetchedNotes || [])

          if (pagination) {
            const pageNum = pagination.page || page || 1
            const totalPagesNum = pagination.totalPages || 1
            setCurrentPage(pageNum)
            setTotalPages(totalPagesNum)
          } else {
            const hasMoreResults = fetchedNotes.length >= PAGE_SIZE
            setCurrentPage(page)
            setTotalPages(hasMoreResults ? page + 1 : page)
          }
        } else {
          setError("Failed to fetch notes")
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
    },
    [logout, router, token],
  )

  // Initial load
  useEffect(() => {
    if (!isAuthenticated || !token || !isVerified) return
    fetchNotes(1, token)
  }, [isAuthenticated, token, isVerified, fetchNotes])

  const handleChangePage = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return
    setCurrentPage(page)
    fetchNotes(page, token)
  }

  const handleOpenModal = () => {
    setNewNoteDescription("")
    setNoteError(undefined)
    setNoteTouched(false)
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setNoteTouched(false)
    setNoteError(undefined)
  }

  const handleNoteChange = (value: string) => {
    setNewNoteDescription(value)
    if (noteTouched) {
      setNoteError(validateNoteDescription(value))
    }
  }

  const handleAddNote = async () => {
    const errorMessage = validateNoteDescription(newNoteDescription)
    if (errorMessage) {
      setNoteError(errorMessage)
      setNoteTouched(true)
      return
    }

    if (!token) {
      await logout()
      router.replace("/auth/sign-in")
      return
    }

    setSubmitting(true)
    try {
      const trimmed = newNoteDescription.trim()
      await axios.post(
        `${BASE_URL}/notes`,
        { description: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      alert("Note added successfully")
      setShowAddModal(false)
      setNewNoteDescription("")
      setNoteTouched(false)
      setNoteError(undefined)
      // Reload first page
      fetchNotes(1, token)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert("Your session has expired. Please sign in again.")
        await logout()
        router.replace("/auth/sign-in")
        return
      }

      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again later"
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkAsDone = async (id: string) => {
    if (!token) {
      await logout()
      router.replace("/auth/sign-in")
      return
    }

    try {
      await axios.delete(`${BASE_URL}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNotes((prev) => prev.filter((note) => note._id !== id))
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert("Your session has expired. Please sign in again.")
        await logout()
        router.replace("/auth/sign-in")
        return
      }

      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again later"
      alert(message)
    }
  }

  const noteHelperText = noteError ? undefined : `Max ${NOTE_MAX_LENGTH} characters`

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
          <div>
            <h1
              style={{
                fontSize: fontSizes.xl,
                fontWeight: fontWeights.bold,
                color: Colors.text,
                marginBottom: spacing.xs,
              }}
            >
              My Notes
            </h1>
            <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
              Keep track of important reminders related to your properties.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenModal}
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
            Add New Note
          </button>
        </header>

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
              ? "Loading notes..."
              : `${notes.length} note${notes.length === 1 ? "" : "s"} found`}
          </span>
        </div>

        {/* Notes list */}
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
        ) : notes.length === 0 && !loading ? (
          <div
            style={{
              padding: spacing.xxxl,
              borderRadius: radius.lg,
              backgroundColor: Colors.neutral10,
              textAlign: "center",
              color: Colors.textSecondary,
            }}
          >
            No notes found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
              gap: spacing.md,
            }}
          >
            {notes.map((note) => (
              <article
                key={note._id}
                style={{
                  backgroundColor: Colors.neutral10,
                  borderRadius: radius.xl,
                  border: `1px solid ${Colors.border}`,
                  padding: spacing.lg,
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.sm,
                  boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
                }}
              >
                <p
                  style={{
                    fontSize: fontSizes.sm,
                    color: Colors.text,
                    lineHeight: 1.5,
                  }}
                >
                  {note.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: spacing.sm,
                    marginTop: spacing.xs,
                  }}
                >
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
                        color: Colors.textSecondary,
                      }}
                    >
                      ⏱
                    </span>
                    <span
                      style={{
                        fontSize: fontSizes.xs,
                        color: Colors.textSecondary,
                      }}
                    >
                      {formatNoteDate(note.createdAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMarkAsDone(note._id)}
                    style={{
                      borderRadius: radius.pill,
                      padding: 0,
                      border: "none",
                      backgroundColor: "transparent",
                      color: Colors.success2,
                      fontSize: fontSizes.xs,
                      fontWeight: fontWeights.semibold,
                      cursor: "pointer",
                    }}
                  >
                    Mark as done
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Numbered pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="My notes pages"
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
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
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
              maxWidth: 480,
              backgroundColor: Colors.neutral10,
              borderRadius: radius.xxl,
              padding: spacing.lg,
              boxShadow: "0 12px 40px rgba(15,23,42,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.sm,
              }}
            >
              <h2
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.bold,
                  color: Colors.text,
                }}
              >
                Add New Note
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: fontSizes.lg,
                  color: Colors.textSecondary,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.xs,
              }}
            >
              <textarea
                rows={4}
                placeholder="Type your note here..."
                value={newNoteDescription}
                onChange={(e) => handleNoteChange(e.target.value)}
                onBlur={() => {
                  setNoteTouched(true)
                  setNoteError(validateNoteDescription(newNoteDescription))
                }}
                style={{
                  width: "100%",
                  borderRadius: radius.lg,
                  border: `1px solid ${noteTouched && noteError ? "#DC2626" : "#D1D5DB"}`,
                  padding: `${spacing.md2}px ${spacing.md}px`,
                  fontSize: fontSizes.sm,
                  resize: "vertical",
                  backgroundColor: Colors.neutral10,
                }}
              />
              {noteTouched && noteError && (
                <p style={{ fontSize: fontSizes.xs, color: Colors.error }}>{noteError}</p>
              )}
              {!noteError && (
                <p style={{ fontSize: fontSizes.xs, color: Colors.textSecondary }}>
                  {noteHelperText}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.xs,
                marginTop: spacing.md,
              }}
            >
              <button
                type="button"
                onClick={handleAddNote}
                disabled={submitting || Boolean(validateNoteDescription(newNoteDescription))}
                style={{
                  borderRadius: radius.pill,
                  padding: `${spacing.md2}px ${spacing.lg}px`,
                  border: "none",
                  backgroundColor:
                    submitting || Boolean(validateNoteDescription(newNoteDescription))
                      ? Colors.neutral60
                      : Colors.neutral100,
                  color: Colors.neutral10,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  cursor:
                    submitting || Boolean(validateNoteDescription(newNoteDescription))
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {submitting ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
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
          </div>
        </div>
      )}
    </div>
  )
}

export default MyNotesPage


