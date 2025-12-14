import { useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { completeOnboarding } from "@repo/utils/auth/onboarding"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../contexts/AuthContext"
import OnboardingSplitLayout from "../components/OnboardingSplitLayout"

const BASE_URL = "https://api.dealkroo.com/api"

const slides = [
  {
    id: 1,
    title: "Add your inventory effortlessly.",
    description: "Add and help other dealers to find and contact you easily.",
  },
  {
    id: 2,
    title: "Deal property required for sale.",
    description: "Easily find on-sale properties through real-time authentic listings.",
  },
  {
    id: 3,
    title: "Deal property for installment plans.",
    description: "Find installment properties through real-time authentic listings.",
  },
] as const

const OnboardingPage: NextPage = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, setUser, checkAuth } = useAuthContext()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const isOnboardingCompleted = Boolean((user as any)?.onBoardingCompleted)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/sign-in")
    }
  }, [isLoading, isAuthenticated, router])

  // If user already completed onboarding, go to listings
  useEffect(() => {
    if (!isLoading && isAuthenticated && isOnboardingCompleted) {
      router.replace("/listings")
    }
  }, [isLoading, isAuthenticated, isOnboardingCompleted, router])

  const handleCompleteOnboarding = async () => {
    if (!token || !user) {
      router.replace("/auth/sign-in")
      return
    }

    setLoading(true)
    try {
      const { user: updatedUser } = await completeOnboarding({
        token,
        userId: user._id,
        baseUrl: BASE_URL,
      })

      await setUser(updatedUser)
      // Refresh auth context (in case other flags depend on this)
      await checkAuth()

      router.replace("/listings")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding. Please try again."
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      void handleCompleteOnboarding()
    }
  }

  if (isLoading || !isAuthenticated || isOnboardingCompleted) {
    return null
  }

  const activeSlide = slides[currentIndex]

  return (
    <OnboardingSplitLayout>
      <div
        style={{
          maxWidth: 380,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacing.xxxl,
        }}
      >
        {/* Logo centered at top */}
        <div
          style={{
            marginBottom: spacing.xl,
          }}
        >
          <img
            src="/black-logo.png"
            alt="Deals Logo"
            style={{
              height: 48,
              width: "auto",
            }}
          />
        </div>

        {/* Content - left aligned */}
        <div
          style={{
            width: "100%",
            textAlign: "left",
          }}
        >
          <h1
            style={{
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.sm,
              lineHeight: 1.3,
            }}
          >
            {activeSlide?.title}
          </h1>
          <p
            style={{
              fontSize: fontSizes.sm,
              color: Colors.textSecondary,
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            {activeSlide?.description}
          </p>
        </div>

        {/* Continue button - left aligned, contained width */}
        <div style={{ width: "100%" }}>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            style={{
              borderRadius: radius.pill,
              width: "100%",
              padding: `${spacing.md2}px ${spacing.xxxl * 2}px`,
              border: "none",
              backgroundColor: loading ? Colors.neutral60 : Colors.neutral100,
              color: Colors.white,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {loading
              ? "Completing..."
              : currentIndex === slides.length - 1
                ? "Get Started"
                : "Continue"}
          </button>
        </div>

        {/* Dots indicator - centered */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            width: "100%",
          }}
        >
          {slides.map((_, index) => (
            <span
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  index === currentIndex ? Colors.neutral80 : Colors.neutral40,
              }}
            />
          ))}
        </div>
      </div>
    </OnboardingSplitLayout>
  )
}

export default OnboardingPage
