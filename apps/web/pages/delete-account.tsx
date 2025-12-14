import type { Metadata } from "next"
import { Trash2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Header } from "../components/common/header"
import { Footer } from "../components/common/footer"

export const metadata: Metadata = {
    title: "Delete Account - Deal Kroo",
    description: "Learn how to delete your Deal Kroo account and understand what data will be removed.",
}

export default function DeleteAccountPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="space-y-12">
                    {/* Page Title */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-destructive/10 rounded-lg">
                                <Trash2 className="w-8 h-8 text-destructive" />
                            </div>
                            <h1 className="text-4xl font-bold text-balance">Delete Your Account</h1>
                        </div>
                        <p className="text-xl text-muted-foreground text-pretty">
                            This page explains how to permanently delete your Deal Kroo account and all associated data from within
                            the mobile application.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
                        <div className="flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-destructive">Important Notice</h2>
                                <p className="text-foreground/90">
                                    Account deletion is permanent and cannot be undone. All your data, including property listings, will
                                    be permanently removed from our systems.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How to Delete Your Account */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">How to Delete Your Account</h2>
                        <p className="text-muted-foreground text-pretty">
                            Deal Kroo provides an easy in-app account deletion feature. Follow these steps to delete your account
                            directly from the mobile application:
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Open the Deal Kroo Mobile App</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Launch the Deal Kroo application on your mobile device and sign in to your account.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Navigate to Account Settings</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Go to your profile or account settings section within the app.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Find the Delete Account Option</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Locate and tap on the "Delete Account" button in your account settings.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Confirm Account Deletion</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Review the information about what will be deleted, then confirm your decision to permanently delete
                                        your account.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                    5
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Account Deleted Successfully</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your account and all associated data will be immediately and permanently deleted from our systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What Gets Deleted */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">What Data Gets Deleted</h2>
                        <p className="text-muted-foreground text-pretty">
                            When you delete your Deal Kroo account, the following data is permanently removed from our systems:
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Personal Information</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your name, contact number, email, and profile details.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Property Listings</h3>
                                    <p className="text-sm text-muted-foreground">
                                        All property listings you have published on the platform.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Account Credentials</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your login credentials and authentication information.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Activity Data</h3>
                                    <p className="text-sm text-muted-foreground">Your app usage history and interaction data.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Retention Policy */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">Data Retention Policy</h2>
                        <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
                            <p className="text-foreground/90">
                                <strong>Immediate Deletion:</strong> When you delete your account using the in-app Delete Account
                                button, all your personal data, property listings, and associated information are immediately and
                                permanently removed from our database.
                            </p>
                            <p className="text-foreground/90">
                                <strong>No Retention Period:</strong> We do not retain any of your data after account deletion. Once
                                deleted, your information cannot be recovered.
                            </p>
                            <p className="text-foreground/90">
                                <strong>Complete Removal:</strong> Your account and all associated data are completely erased from our
                                systems with no backup copies maintained.
                            </p>
                        </div>
                    </section>

                    {/* Need Help */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">Need Help?</h2>
                        <div className="bg-muted/50 border border-border rounded-lg p-6">
                            <p className="text-foreground/90 mb-4">
                                If you encounter any issues while trying to delete your account or have questions about the deletion
                                process, please contact our support team:
                            </p>
                            <div className="space-y-2">
                                <p className="text-foreground/90">
                                    <strong>Email:</strong>{" "}
                                    <a href="mailto:dealkaroo1@gmail.com" className="text-primary hover:underline">
                                        dealkaroo1@gmail.com
                                    </a>
                                </p>
                                <p className="text-foreground/90">
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