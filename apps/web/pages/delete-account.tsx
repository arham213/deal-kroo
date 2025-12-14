import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "../components/common/header"
import { Footer } from "../components/common/footer"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing, radius } from "@repo/utils/styles/tokens"

export const metadata: Metadata = {
    title: "Delete Account - Deal Kroo",
    description: "Learn how to delete your Deal Kroo account and understand what data will be removed.",
}

export default function DeleteAccountPage() {
    const sectionStyle = {
        marginBottom: spacing.xxxl,
    }

    const h2Style = {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        color: Colors.text,
        marginBottom: spacing.lg,
    }

    const pStyle = {
        fontSize: fontSizes.sm,
        color: Colors.textSecondary,
        marginBottom: spacing.lg,
        lineHeight: 1.7,
    }

    const cardStyle = {
        backgroundColor: Colors.neutral20,
        border: `1px solid ${Colors.border}`,
        borderRadius: radius.lg,
        padding: spacing.xxl,
    }

    const stepCardStyle = {
        display: "flex",
        gap: spacing.lg,
        padding: spacing.lg,
        backgroundColor: Colors.neutral20,
        borderRadius: radius.md,
        border: `1px solid ${Colors.border}`,
    }

    const stepNumberStyle = {
        flexShrink: 0,
        width: 32,
        height: 32,
        backgroundColor: Colors.neutral100,
        color: Colors.neutral10,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: fontWeights.semibold,
        fontSize: fontSizes.sm,
    }

    const checkCardStyle = {
        display: "flex",
        gap: spacing.md,
        padding: spacing.lg,
        backgroundColor: Colors.neutral20,
        borderRadius: radius.md,
        border: `1px solid ${Colors.border}`,
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: Colors.neutral10 }}>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: 900, margin: "0 auto", padding: `${spacing.xxxxl}px ${spacing.xxl}px` }}>
                <div>
                    {/* Page Title */}
                    <div style={{ marginBottom: spacing.xxxl }}>
                        <div style={{ display: "flex", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                            <div
                                style={{
                                    padding: spacing.md,
                                    backgroundColor: "rgba(255, 56, 60, 0.1)",
                                    borderRadius: radius.md,
                                }}
                            >
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={Colors.error}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </div>
                            <h1
                                style={{
                                    fontSize: fontSizes.xxxl,
                                    fontWeight: fontWeights.bold,
                                    color: Colors.text,
                                }}
                            >
                                Delete Your Account
                            </h1>
                        </div>
                        <p style={{ fontSize: fontSizes.md, color: Colors.textSecondary, lineHeight: 1.6 }}>
                            This page explains how to permanently delete your Deal Kroo account and all associated data from within
                            the mobile application.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div
                        style={{
                            backgroundColor: "rgba(255, 56, 60, 0.05)",
                            border: "1px solid rgba(255, 56, 60, 0.2)",
                            borderRadius: radius.lg,
                            padding: spacing.xxl,
                            marginBottom: spacing.xxxl,
                        }}
                    >
                        <div style={{ display: "flex", gap: spacing.lg }}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={Colors.error}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ flexShrink: 0, marginTop: 2 }}
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <div>
                                <h2
                                    style={{
                                        fontSize: fontSizes.md,
                                        fontWeight: fontWeights.semibold,
                                        color: Colors.error,
                                        marginBottom: spacing.sm,
                                    }}
                                >
                                    Important Notice
                                </h2>
                                <p style={{ color: Colors.text, fontSize: fontSizes.sm, lineHeight: 1.6 }}>
                                    Account deletion is permanent and cannot be undone. All your data, including property listings, will
                                    be permanently removed from our systems.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How to Delete Your Account */}
                    <section style={sectionStyle}>
                        <h2 style={h2Style}>How to Delete Your Account</h2>
                        <p style={pStyle}>
                            Deal Kroo provides an easy in-app account deletion feature. Follow these steps to delete your account
                            directly from the mobile application:
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}>
                            <div style={stepCardStyle as React.CSSProperties}>
                                <div style={stepNumberStyle as React.CSSProperties}>1</div>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Open the Deal Kroo Mobile App
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Launch the Deal Kroo application on your mobile device and sign in to your account.
                                    </p>
                                </div>
                            </div>

                            <div style={stepCardStyle as React.CSSProperties}>
                                <div style={stepNumberStyle as React.CSSProperties}>2</div>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Navigate to Account Settings
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Go to your profile or account settings section within the app.
                                    </p>
                                </div>
                            </div>

                            <div style={stepCardStyle as React.CSSProperties}>
                                <div style={stepNumberStyle as React.CSSProperties}>3</div>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Find the Delete Account Option
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Locate and tap on the "Delete Account" button in your account settings.
                                    </p>
                                </div>
                            </div>

                            <div style={stepCardStyle as React.CSSProperties}>
                                <div style={stepNumberStyle as React.CSSProperties}>4</div>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Confirm Account Deletion
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Review the information about what will be deleted, then confirm your decision to permanently delete
                                        your account.
                                    </p>
                                </div>
                            </div>

                            <div style={stepCardStyle as React.CSSProperties}>
                                <div style={stepNumberStyle as React.CSSProperties}>5</div>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Account Deleted Successfully
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Your account and all associated data will be immediately and permanently deleted from our systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What Gets Deleted */}
                    <section style={sectionStyle}>
                        <h2 style={h2Style}>What Data Gets Deleted</h2>
                        <p style={pStyle}>
                            When you delete your Deal Kroo account, the following data is permanently removed from our systems:
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: spacing.lg }}>
                            <div style={checkCardStyle as React.CSSProperties}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={Colors.success2}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flexShrink: 0, marginTop: 2 }}
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Personal Information
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Your name, contact number, email, and profile details.
                                    </p>
                                </div>
                            </div>

                            <div style={checkCardStyle as React.CSSProperties}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={Colors.success2}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flexShrink: 0, marginTop: 2 }}
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Property Listings
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        All property listings you have published on the platform.
                                    </p>
                                </div>
                            </div>

                            <div style={checkCardStyle as React.CSSProperties}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={Colors.success2}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flexShrink: 0, marginTop: 2 }}
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Account Credentials
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Your login credentials and authentication information.
                                    </p>
                                </div>
                            </div>

                            <div style={checkCardStyle as React.CSSProperties}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={Colors.success2}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flexShrink: 0, marginTop: 2 }}
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <div>
                                    <h3 style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.xs }}>
                                        Activity Data
                                    </h3>
                                    <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
                                        Your app usage history and interaction data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Retention Policy */}
                    <section style={sectionStyle}>
                        <h2 style={h2Style}>Data Retention Policy</h2>
                        <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: spacing.lg }}>
                            <p style={{ color: Colors.text, fontSize: fontSizes.sm, lineHeight: 1.6 }}>
                                <strong>Immediate Deletion:</strong> When you delete your account using the in-app Delete Account
                                button, all your personal data, property listings, and associated information are immediately and
                                permanently removed from our database.
                            </p>
                            <p style={{ color: Colors.text, fontSize: fontSizes.sm, lineHeight: 1.6 }}>
                                <strong>No Retention Period:</strong> We do not retain any of your data after account deletion. Once
                                deleted, your information cannot be recovered.
                            </p>
                            <p style={{ color: Colors.text, fontSize: fontSizes.sm, lineHeight: 1.6 }}>
                                <strong>Complete Removal:</strong> Your account and all associated data are completely erased from our
                                systems with no backup copies maintained.
                            </p>
                        </div>
                    </section>

                    {/* Need Help */}
                    <section style={sectionStyle}>
                        <h2 style={h2Style}>Need Help?</h2>
                        <div style={cardStyle}>
                            <p style={{ color: Colors.text, fontSize: fontSizes.sm, lineHeight: 1.6, marginBottom: spacing.lg }}>
                                If you encounter any issues while trying to delete your account or have questions about the deletion
                                process, please contact our support team:
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
                                <p style={{ color: Colors.text, fontSize: fontSizes.sm }}>
                                    <strong>Email:</strong>{" "}
                                    <a href="mailto:dealkaroo1@gmail.com" style={{ color: Colors.text, textDecoration: "underline" }}>
                                        dealkaroo1@gmail.com
                                    </a>
                                </p>
                                <p style={{ color: Colors.text, fontSize: fontSizes.sm }}>
                                    <strong>App Name:</strong> Deal Kroo
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}