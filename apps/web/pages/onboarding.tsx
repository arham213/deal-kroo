import { useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { completeOnboarding } from "@repo/utils/auth/onboarding"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../contexts/AuthContext"
import OnboardingSplitLayout from "../components/OnboardingSplitLayout"

const BASE_URL = "https://deal-karo-backend.vercel.app/api"

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

      alert("Onboarding completed successfully!")
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
          maxWidth: 420,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: spacing.xxxl,
        }}
      >
        {/* Logo placeholder */}
        <div
          style={{
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.bold,
            letterSpacing: 4,
            marginBottom: spacing.xl,
          }}
        >
          DEALS
        </div>

        <div>
          <h1
            style={{
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.sm,
            }}
          >
            {activeSlide?.title}
          </h1>
          <p
            style={{
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
              maxWidth: 420,
            }}
          >
            {activeSlide?.description}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          style={{
            marginTop: spacing.xl,
            borderRadius: radius.pill,
            padding: `${spacing.md2}px ${spacing.lg * 2}px`,
            border: "none",
            backgroundColor: loading ? Colors.neutral60 : Colors.neutral100,
            color: Colors.white,
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.semibold,
            cursor: loading ? "not-allowed" : "pointer",
            alignSelf: "flex-start",
          }}
        >
          {loading
            ? "Completing..."
            : currentIndex === slides.length - 1
              ? "Get Started"
              : "Continue"}
        </button>

        <div
          style={{
            marginTop: spacing.xl,
            display: "flex",
            gap: 8,
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


