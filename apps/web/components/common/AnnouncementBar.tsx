"use client"

import { Colors } from "@repo/utils/constants/colors"
import { spacing, fontSizes, fontWeights } from "@repo/utils/styles/tokens"
import type { User } from "@repo/utils/types/auth"

interface AnnouncementBarProps {
    user: User | null
}

export function AnnouncementBar({ user }: AnnouncementBarProps) {
    if (!user || user.verificationStatus === "verified") {
        return null
    }

    const getAnnouncementConfig = () => {
        switch (user.verificationStatus) {
            case "pending":
                return {
                    message: "Your account will be verified under 24 hours. You will then be able to add, view and update listings.",
                    bgColor: "rgba(245, 158, 11, 0.15)",
                    textColor: "#92400e",
                    borderColor: "rgba(245, 158, 11, 0.3)",
                }
            case "rejected":
                return {
                    message: "Your account verification was rejected. Please contact support for more information.",
                    bgColor: "rgba(239, 68, 68, 0.1)",
                    textColor: "#991b1b",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                }
            case "revoked":
                return {
                    message: "Your account access has been revoked. Please contact support to resolve this issue.",
                    bgColor: "rgba(239, 68, 68, 0.1)",
                    textColor: "#991b1b",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                }
            default:
                return null
        }
    }

    const config = getAnnouncementConfig()
    if (!config) return null

    return (
        <div
            style={{
                backgroundColor: config.bgColor,
                borderBottom: `1px solid ${config.borderColor}`,
                padding: `${spacing.md}px ${spacing.xxl}px`,
                textAlign: "center",
            }}
        >
            <p
                style={{
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.regular,
                    color: config.textColor,
                    margin: 0,
                    lineHeight: 1.5,
                }}
            >
                {config.message}
            </p>
        </div>
    )
}
