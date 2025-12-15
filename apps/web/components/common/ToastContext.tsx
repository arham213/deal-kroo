"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Colors } from "@repo/utils/constants/colors"
import { spacing, fontSizes, fontWeights, radius } from "@repo/utils/styles/tokens"

export type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
    id: string
    message: string
    type: ToastType
    title?: string
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, title?: string) => void
    showSuccessToast: (message: string, title?: string) => void
    showErrorToast: (message: string, title?: string) => void
    showInfoToast: (message: string, title?: string) => void
    showWarningToast: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

const toastColors: Record<ToastType, { bg: string; border: string; text: string; icon: string; accent: string }> = {
    success: {
        bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "#22c55e",
        text: "#166534",
        icon: "#22c55e",
        accent: "#22c55e",
    },
    error: {
        bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
        border: "#ef4444",
        text: "#991b1b",
        icon: "#ef4444",
        accent: "#ef4444",
    },
    info: {
        bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "#3b82f6",
        text: "#1e40af",
        icon: "#3b82f6",
        accent: "#3b82f6",
    },
    warning: {
        bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        border: "#f59e0b",
        text: "#92400e",
        icon: "#f59e0b",
        accent: "#f59e0b",
    },
}

const ToastIcon = ({ type }: { type: ToastType }) => {
    const color = toastColors[type].icon

    switch (type) {
        case "success":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill={color} opacity="0.15" />
                    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                    <path d="M8 12l3 3 5-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        case "error":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill={color} opacity="0.15" />
                    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            )
        case "info":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill={color} opacity="0.15" />
                    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                    <path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            )
        case "warning":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 20h20L12 2z" fill={color} opacity="0.15" />
                    <path d="M12 2L2 20h20L12 2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            )
    }
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback(
        (message: string, type: ToastType = "info", title?: string) => {
            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            const newToast: Toast = { id, message, type, title }

            setToasts((prev) => [...prev, newToast])

            // Auto dismiss after 4 seconds
            setTimeout(() => {
                removeToast(id)
            }, 4000)
        },
        [removeToast]
    )

    const showSuccessToast = useCallback(
        (message: string, title?: string) => showToast(message, "success", title),
        [showToast]
    )

    const showErrorToast = useCallback(
        (message: string, title?: string) => showToast(message, "error", title),
        [showToast]
    )

    const showInfoToast = useCallback(
        (message: string, title?: string) => showToast(message, "info", title),
        [showToast]
    )

    const showWarningToast = useCallback(
        (message: string, title?: string) => showToast(message, "warning", title),
        [showToast]
    )

    return (
        <ToastContext.Provider
            value={{ showToast, showSuccessToast, showErrorToast, showInfoToast, showWarningToast }}
        >
            {children}

            {/* Toast Container */}
            <div
                className="toast-container"
            >
                {toasts.map((toast) => {
                    const colors = toastColors[toast.type]
                    return (
                        <div
                            key={toast.id}
                            style={{
                                display: "flex",
                                alignItems: "stretch",
                                background: colors.bg,
                                borderRadius: radius.lg,
                                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)",
                                animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Colored accent bar */}
                            <div
                                style={{
                                    width: 5,
                                    backgroundColor: colors.accent,
                                    flexShrink: 0,
                                }}
                            />
                            {/* Content */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: spacing.md,
                                    padding: `${spacing.lg}px ${spacing.xl}px`,
                                    flex: 1,
                                }}
                            >
                                <div style={{ flexShrink: 0 }}>
                                    <ToastIcon type={toast.type} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {toast.title && (
                                        <div
                                            style={{
                                                fontSize: fontSizes.base,
                                                fontWeight: fontWeights.semibold,
                                                color: colors.text,
                                                marginBottom: spacing.xxs,
                                            }}
                                        >
                                            {toast.title}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            fontSize: fontSizes.sm,
                                            color: colors.text,
                                            lineHeight: 1.5,
                                            opacity: 0.9,
                                        }}
                                    >
                                        {toast.message}
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 4,
                                        opacity: 0.5,
                                        marginRight: -4,
                                        transition: "opacity 0.2s",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = "0.5"}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2.5" strokeLinecap="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-container {
            position: fixed;
            top: 32px;
            right: 32px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end; /* Align to right */
            gap: 16px;
            max-width: 420px;
            min-width: 320px;
        }

        @media (max-width: 480px) {
            .toast-container {
                right: 16px;
                left: 16px;
                top: 16px;
                min-width: 0;
                width: auto;
                max-width: none;
                align-items: center;
            }
        }
      `}</style>
        </ToastContext.Provider>
    )
}
