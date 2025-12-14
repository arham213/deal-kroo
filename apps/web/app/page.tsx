import Link from "next/link"
import Image from "next/image"
import { Header } from "../components/common/header"
import { Footer } from "../components/common/footer"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing, radius } from "@repo/utils/styles/tokens"

export default function HomePage() {
  const cardStyle = {
    backgroundColor: Colors.neutral10,
    border: `1px solid ${Colors.border}`,
    borderRadius: radius.xl,
    padding: spacing.xxxl,
  }

  const iconBoxStyle = {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: Colors.neutral20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: Colors.neutral10 }}>
      <Header />

      {/* Hero Section */}
      <section style={{ padding: `${spacing.xxxxl * 2}px ${spacing.xxl}px`, overflow: "hidden" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: spacing.sm,
              backgroundColor: "transparent",
              border: `1px solid ${Colors.success2}`,
              padding: `${spacing.sm}px ${spacing.lg}px`,
              borderRadius: radius.pill,
              marginBottom: spacing.xxl,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                backgroundColor: Colors.success2,
                borderRadius: "50%",
              }}
            ></span>
            <span style={{ color: Colors.success2, fontSize: fontSizes.sm, fontWeight: fontWeights.medium }}>
              Live on App Store
            </span>
          </div>

          <h1
            style={{
              fontSize: 48,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.xxl,
              lineHeight: 1.2,
            }}
          >
            Connect Dealers, Simplify Property Discovery
          </h1>

          <p
            style={{
              fontSize: fontSizes.md,
              color: Colors.textSecondary,
              maxWidth: 700,
              margin: `0 auto ${spacing.xxxl}px`,
              lineHeight: 1.6,
            }}
          >
            Deal Kroo brings real estate dealers together on one platform. Publish your property listings and discover
            available properties from fellow dealers within a few clicks.
          </p>

          {/* Platform Availability */}
          <style>{`
            .platform-container {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              gap: ${spacing.xxxl}px;
            }
            .platform-item {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: ${spacing.md}px;
            }
            @media (max-width: 768px) {
              .platform-container {
                flex-direction: column;
                gap: ${spacing.xxl}px;
              }
              .platform-item {
                flex-direction: column;
                text-align: center;
                gap: ${spacing.sm}px;
              }
            }
          `}</style>
          <div
            className="platform-container"
            style={{
              padding: `${spacing.xxl}px ${spacing.lg}px`,
              backgroundColor: Colors.neutral20,
              borderRadius: radius.lg,
              maxWidth: 900,
              margin: `0 auto ${spacing.xxxl}px`,
            }}
          >
            {/* Web */}
            <div className="platform-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.textSecondary} strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.medium, color: Colors.text }}>
                Available on Web
              </span>
            </div>

            {/* App Store */}
            <div className="platform-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill={Colors.text}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.medium, color: Colors.text }}>
                Available on App Store
              </span>
            </div>

            {/* Play Store */}
            <div className="platform-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill={Colors.textSecondary}>
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span style={{ fontSize: fontSizes.sm, fontWeight: fontWeights.medium, color: Colors.text }}>
                Available on Play Store
              </span>
              <span
                style={{
                  fontSize: fontSizes.xs,
                  backgroundColor: Colors.neutral30,
                  padding: `${spacing.xxs}px ${spacing.sm}px`,
                  borderRadius: radius.pill,
                  color: Colors.textSecondary,
                }}
              >
                Coming soon
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.lg, justifyContent: "center" }}>
            <a
              href="https://apps.apple.com/us/app/deal-kroo/id6755895370"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacing.sm,
                padding: `${spacing.md}px ${spacing.xxl}px`,
                borderRadius: radius.pill,
                backgroundColor: Colors.neutral100,
                color: Colors.neutral10,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.medium,
                textDecoration: "none",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </a>
            <Link
              href="/auth/sign-in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacing.sm,
                padding: `${spacing.md}px ${spacing.xxl}px`,
                borderRadius: radius.pill,
                backgroundColor: "transparent",
                border: `1px solid ${Colors.border}`,
                color: Colors.text,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.medium,
                textDecoration: "none",
              }}
            >
              Sign In
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: `${spacing.xxxxl * 2}px ${spacing.xxl}px` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: spacing.xxxxl }}>
            <h2
              style={{
                fontSize: fontSizes.xxxl,
                fontWeight: fontWeights.bold,
                color: Colors.text,
                marginBottom: spacing.lg,
              }}
            >
              Everything Dealers Need in One Place
            </h2>
            <p
              style={{
                fontSize: fontSizes.md,
                color: Colors.textSecondary,
                maxWidth: 700,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              A streamlined platform designed specifically for dealer-to-dealer property interactions and networking.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: spacing.xxl,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <div style={cardStyle}>
              <div style={iconBoxStyle as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                  <path d="M10 6h4"></path>
                  <path d="M10 10h4"></path>
                  <path d="M10 14h4"></path>
                  <path d="M10 18h4"></path>
                </svg>
              </div>
              <h3
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                  marginBottom: spacing.md,
                }}
              >
                Add Inventory Effortlessly
              </h3>
              <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary, lineHeight: 1.6 }}>
                Publish your property listings quickly and make it easy for other dealers to find and contact you.
                Streamline your inventory management with an intuitive interface.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={iconBoxStyle as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                  marginBottom: spacing.md,
                }}
              >
                Deal Property Required for Sale
              </h3>
              <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary, lineHeight: 1.6 }}>
                Discover properties available for sale from verified dealers. Access real-time authentic listings and
                connect directly with property owners.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={iconBoxStyle as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                  marginBottom: spacing.md,
                }}
              >
                Deal Property for Instalment Plans
              </h3>
              <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary, lineHeight: 1.6 }}>
                Find properties with flexible installment payment options. Browse authenticated listings and offer your
                clients more purchasing flexibility.
              </p>
            </div>
          </div>

          <div style={{ maxWidth: 700, margin: `${spacing.xxxl}px auto 0` }}>
            <div style={{ ...cardStyle, display: "flex", flexWrap: "wrap", gap: spacing.xxl, alignItems: "flex-start" }}>
              <div style={{ ...iconBoxStyle as React.CSSProperties, marginBottom: 0, flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 250 }}>
                <h3
                  style={{
                    fontSize: fontSizes.lg,
                    fontWeight: fontWeights.semibold,
                    color: Colors.text,
                    marginBottom: spacing.md,
                  }}
                >
                  Dealer-to-Dealer Network
                </h3>
                <p style={{ fontSize: fontSizes.sm, color: Colors.textSecondary, lineHeight: 1.6 }}>
                  Connect with a growing network of verified real estate dealers. Share listings, discover
                  opportunities, and build valuable professional relationships all in one centralized platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: `${spacing.xxxxl * 2}px ${spacing.xxl}px`, backgroundColor: Colors.neutral20 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: fontSizes.xxxl,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.xxl,
            }}
          >
            Why Deal Kroo?
          </h2>
          <p
            style={{
              fontSize: fontSizes.md,
              color: Colors.textSecondary,
              marginBottom: spacing.xxl,
              lineHeight: 1.7,
            }}
          >
            Deal Kroo is built specifically for real estate dealers who need a centralized platform to publish and
            discover property listings. No more scattered contacts or missed opportunities.
          </p>
          <p
            style={{
              fontSize: fontSizes.md,
              color: Colors.textSecondary,
              lineHeight: 1.7,
            }}
          >
            Our mobile app is now live on the App Store! Google Play Store and web versions are coming soon. Download
            now and join the growing network of real estate dealers.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: `${spacing.xxxxl * 2}px ${spacing.xxl}px` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: fontSizes.xxxl,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.xxl,
            }}
          >
            Join Deal Kroo Today
          </h2>
          <p
            style={{
              fontSize: fontSizes.md,
              color: Colors.textSecondary,
              marginBottom: spacing.xxxl,
              lineHeight: 1.7,
            }}
          >
            Download Deal Kroo from the App Store now and start connecting with real estate dealers. Transform how you
            discover and share property listings.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.lg, justifyContent: "center" }}>
            <a
              href="https://apps.apple.com/us/app/deal-kroo/id6755895370"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacing.sm,
                padding: `${spacing.md}px ${spacing.xxl}px`,
                borderRadius: radius.pill,
                backgroundColor: Colors.neutral100,
                color: Colors.neutral10,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.medium,
                textDecoration: "none",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </a>
            <Link
              href="/auth/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacing.sm,
                padding: `${spacing.md}px ${spacing.xxl}px`,
                borderRadius: radius.pill,
                backgroundColor: "transparent",
                border: `1px solid ${Colors.border}`,
                color: Colors.text,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.medium,
                textDecoration: "none",
              }}
            >
              Sign Up Now
            </Link>
            <Link
              href="/privacy-policy"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: `${spacing.md}px ${spacing.xxl}px`,
                borderRadius: radius.pill,
                backgroundColor: "transparent",
                border: `1px solid ${Colors.border}`,
                color: Colors.text,
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.medium,
                textDecoration: "none",
              }}
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
