import Link from "next/link"
import { Header } from "../components/common/header"
import { Footer } from "../components/common/footer"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing, radius } from "@repo/utils/styles/tokens"

export const metadata = {
    title: "Privacy Policy | Deal Kroo",
    description: "Privacy Policy for Deal Kroo - Dealer-to-Dealer Real Estate Platform",
}

export default function PrivacyPolicyPage() {
    const sectionStyle = {
        marginBottom: spacing.xxxl,
    }

    const h2Style = {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        color: Colors.text,
        marginBottom: spacing.lg,
    }

    const h3Style = {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.medium,
        color: Colors.text,
        marginBottom: spacing.md,
        marginTop: spacing.xxl,
    }

    const pStyle = {
        fontSize: fontSizes.sm,
        color: Colors.textSecondary,
        marginBottom: spacing.lg,
        lineHeight: 1.7,
    }

    const listStyle = {
        paddingLeft: spacing.xxl,
        color: Colors.textSecondary,
        fontSize: fontSizes.sm,
        lineHeight: 1.8,
        listStyleType: "disc",
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: Colors.neutral10 }}>
            <Header />

            {/* Content */}
            <main style={{ maxWidth: 900, margin: "0 auto", padding: `${spacing.xxxxl}px ${spacing.xxl}px` }}>
                <h1
                    style={{
                        fontSize: fontSizes.xxxl,
                        fontWeight: fontWeights.bold,
                        color: Colors.text,
                        marginBottom: spacing.lg,
                    }}
                >
                    Privacy Policy
                </h1>
                <p style={{ color: Colors.textSecondary, fontSize: fontSizes.sm, marginBottom: spacing.xxxl }}>
                    Last Updated: November 21, 2025
                </p>

                <div>
                    <section style={sectionStyle}>
                        <h2 style={h2Style}>1. Introduction</h2>
                        <p style={pStyle}>
                            Welcome to Deal Kroo ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the
                            security of your personal information. This Privacy Policy explains how we collect, use, disclose, and
                            safeguard your information when you use our mobile application and web platform (collectively, the
                            "Services").
                        </p>
                        <p style={pStyle}>
                            Deal Kroo is a dealer-to-dealer platform that enables real estate professionals to publish property
                            listings and discover available properties from other verified dealers in one centralized location.
                        </p>
                        <p style={pStyle}>
                            By using Deal Kroo, you agree to the collection and use of information in accordance with this Privacy
                            Policy. If you do not agree with our policies and practices, please do not use our Services.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>2. Information We Collect</h2>

                        <h3 style={h3Style}>2.1 Personal Information</h3>
                        <p style={pStyle}>
                            We collect information that you provide directly to us when registering as a dealer, including:
                        </p>
                        <ul style={listStyle}>
                            <li>Full name</li>
                            <li>Contact number (phone number)</li>
                            <li>Email address</li>
                            <li>Estate name</li>
                            <li>Password (encrypted and securely stored)</li>
                        </ul>

                        <h3 style={h3Style}>2.2 Property Listing Information</h3>
                        <p style={pStyle}>
                            When you use our Services to publish or search for property listings, we collect:
                        </p>
                        <ul style={listStyle}>
                            <li>Property details (location, area, price, contact number)</li>
                            <li>Property description</li>
                            <li>Listing preferences (sale, installment plans)</li>
                        </ul>

                        <h3 style={h3Style}>2.3 Device Information</h3>
                        <p style={pStyle}>
                            We automatically collect limited device information when you use our Services:
                        </p>
                        <ul style={listStyle}>
                            <li>Device type (to optimize app display and functionality)</li>
                            <li>Operating system version (for compatibility purposes)</li>
                        </ul>
                        <p style={pStyle}>
                            We do not collect or store detailed device identifiers, location data, browsing history, or other
                            extensive tracking information.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>3. How We Use Your Information</h2>
                        <p style={pStyle}>
                            We use the collected information for various purposes:
                        </p>
                        <ul style={listStyle}>
                            <li>To provide, maintain, and improve our dealer-to-dealer platform</li>
                            <li>To create and manage your dealer account</li>
                            <li>To enable you to publish and manage property listings</li>
                            <li>To facilitate discovery and communication between dealers</li>
                            <li>To verify dealer authenticity and maintain platform integrity</li>
                            <li>To enable direct phone calls to other dealers using your device's native calling app</li>
                            <li>To send you technical notices, updates, and security alerts</li>
                            <li>To respond to your inquiries and provide customer support</li>
                            <li>To send you relevant notifications about new listings and platform updates (with your consent)</li>
                            <li>To detect, prevent, and address technical issues and fraudulent activity</li>
                            <li>To comply with legal obligations and enforce our terms of service</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>4. Information Sharing and Disclosure</h2>
                        <p style={pStyle}>
                            We may share your information in the following circumstances:
                        </p>

                        <h3 style={h3Style}>4.1 With Other Dealers</h3>
                        <p style={pStyle}>
                            When you publish a property listing on Deal Kroo, certain information (such as your dealership name,
                            contact details, and property information) will be visible to other verified dealers on the platform to
                            facilitate property discovery and dealer-to-dealer communication.
                        </p>

                        <h3 style={h3Style}>4.2 Service Providers</h3>
                        <p style={pStyle}>
                            We may share your information with trusted third-party service providers who perform services on our
                            behalf, such as cloud hosting, data analysis, SMS/email notifications, and technical support. These
                            providers are bound by confidentiality obligations.
                        </p>

                        <h3 style={h3Style}>4.3 Legal Requirements</h3>
                        <p style={pStyle}>
                            We may disclose your information if required to do so by law or in response to valid requests by public
                            authorities (e.g., court orders, government agencies, or regulatory bodies).
                        </p>

                        <h3 style={h3Style}>4.4 Business Transfers</h3>
                        <p style={pStyle}>
                            In the event of a merger, acquisition, reorganization, or sale of assets, your information may be
                            transferred as part of that transaction. We will notify you of any such change in ownership or control.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>5. Data Security</h2>
                        <p style={pStyle}>
                            We implement appropriate technical and organizational security measures to protect your personal
                            information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul style={listStyle}>
                            <li>Encryption of passwords in transit and at rest</li>
                            <li>Secure authentication mechanisms (OTP verification)</li>
                            <li>Regular security assessments and updates</li>
                            <li>Access controls</li>
                            <li>Secure backup and recovery procedures</li>
                        </ul>
                        <p style={pStyle}>
                            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive
                            to use commercially acceptable means to protect your information, we cannot guarantee its absolute
                            security.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>6. Your Rights and Choices</h2>
                        <p style={pStyle}>
                            You have certain rights regarding your personal information:
                        </p>
                        <ul style={listStyle}>
                            <li>
                                <strong>Access and Update:</strong> You can access and update your dealer account information at any
                                time through the app settings.
                            </li>
                            <li>
                                <strong>Delete Account:</strong> You can request deletion of your account and associated data by
                                contacting us. Please note that some information may be retained for legal or legitimate business
                                purposes.
                            </li>
                            <li>
                                <strong>Manage Listings:</strong> You can edit or remove your property listings at any time through the
                                app.
                            </li>
                            <li>
                                <strong>Data Portability:</strong> You can request a copy of your personal information in a structured,
                                machine-readable format.
                            </li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>7. Data Retention and Deletion</h2>
                        <p style={pStyle}>
                            We retain your personal information for as long as your account is active or as needed to provide you with
                            our Services. We may also retain certain information as necessary to comply with legal obligations,
                            resolve disputes, and enforce our agreements.
                        </p>
                        <p style={pStyle}>
                            <strong>Account Deletion:</strong> When you delete your account, we permanently delete all your personal
                            data and associated information from our systems. This includes your profile information, property
                            listings, communication history, and all other user-generated content. We do not retain any of your
                            personal data after account deletion, except where required by law for a limited period.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>8. Children's Privacy</h2>
                        <p style={pStyle}>
                            Our Services are intended for use by real estate professionals and are not designed for children under the
                            age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian
                            and believe your child has provided us with personal information, please contact us, and we will delete
                            such information.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>9. International Data Transfers</h2>
                        <p style={pStyle}>
                            Your information may be transferred to and maintained on servers located outside of your country or
                            region, where data protection laws may differ. By using our Services, you consent to the transfer of your
                            information to such locations. We take appropriate measures to ensure your data is protected in accordance
                            with this Privacy Policy.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>10. Changes to This Privacy Policy</h2>
                        <p style={pStyle}>
                            We may update this Privacy Policy from time to time to reflect changes in our practices, legal
                            requirements, or for other operational reasons. We will notify you of any material changes by posting the
                            new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we may
                            provide additional notice (such as an in-app notification or email). Your continued use of our Services
                            after such changes constitutes your acceptance of the updated Privacy Policy.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>11. Contact Us</h2>
                        <p style={pStyle}>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
                            please contact us at:
                        </p>
                        <div
                            style={{
                                backgroundColor: Colors.neutral20,
                                padding: spacing.xxl,
                                borderRadius: radius.lg,
                            }}
                        >
                            <p style={{ fontWeight: fontWeights.semibold, color: Colors.text, marginBottom: spacing.sm }}>
                                Deal Kroo Support Team
                            </p>
                            <p style={{ color: Colors.textSecondary, fontSize: fontSizes.sm, marginBottom: spacing.xs }}>
                                Email:{" "}
                                <a href="mailto:dealkaroo1@gmail.com" style={{ color: Colors.text, textDecoration: "underline" }}>
                                    dealkaroo1@gmail.com
                                </a>
                            </p>
                            <p style={{ color: Colors.textSecondary, fontSize: fontSizes.sm, marginBottom: spacing.xs }}>
                                Phone:{" "}
                                <a href="tel:+(92) 302 1666650" style={{ color: Colors.text, textDecoration: "underline" }}>
                                    +(92) 302 1666650
                                </a>
                            </p>
                            <p style={{ color: Colors.textSecondary, fontSize: fontSizes.sm }}>
                                We aim to respond to all privacy-related inquiries within 48 hours.
                            </p>
                        </div>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>12. Consent and Acceptance</h2>
                        <p style={pStyle}>
                            By using Deal Kroo, you acknowledge that you have read and understood this Privacy Policy and consent to
                            the collection, use, and disclosure of your information as described herein. If you do not agree with this
                            policy, please do not use our Services.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>13. App Store Compliance</h2>
                        <p style={pStyle}>
                            This Privacy Policy is designed to meet the requirements of the Google Play Store and Apple App Store. We
                            are committed to transparency in our data practices and compliance with all applicable app store policies
                            and data protection regulations.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
