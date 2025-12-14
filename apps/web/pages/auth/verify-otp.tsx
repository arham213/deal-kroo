import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../../contexts/AuthContext"
import { useToast } from "../../components/common/ToastContext"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import { Button } from "../../components/Button"
import {
  OTP_LENGTH,
  resendOtp,
  verifyOtp,
} from "@repo/utils/auth/verifyOtp"

export default function VerifyOtpPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthContext()
  const { showSuccessToast, showErrorToast } = useToast()
  const { userId, isSignupOTP } = router.query as {
    userId?: string
    isSignupOTP?: string
  }

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [touched, setTouched] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const otpString = useMemo(() => otp.join(""), [otp])

  const isOtpValidLength = useMemo(
    () => otpString.length === OTP_LENGTH,
    [otpString],
  )

  const showError = touched && !isOtpValidLength
  const isSubmitDisabled = loading || !isOtpValidLength

  const handleVerifyOTP = async () => {
    if (!userId) {
      setTouched(true)
      showErrorToast("Invalid or missing user identifier. Please retry the flow.")
      return
    }

    if (!isOtpValidLength) {
      setTouched(true)
      return
    }

    try {
      setLoading(true)

      const result = await verifyOtp({
        userId: String(userId),
        isSignupOtp: isSignupOTP === "true",
        otpCode: otpString,
      })

      setTouched(false)
      setOtp(Array(OTP_LENGTH).fill(""))

      if (result.type === "signup") {
        await setToken(result.token)
        await setUser(result.user)
        showSuccessToast("Email verified successfully!")
        router.replace("/onboarding")
      } else {
        showSuccessToast("OTP verified successfully!")
        router.push({
          pathname: "/auth/reset-password",
          query: { userId: result.userId },
        })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      showErrorToast(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!userId) {
      showErrorToast("Invalid or missing user identifier. Please retry the flow.")
      return
    }

    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    try {
      setLoading(true)

      await resendOtp({
        userId: String(userId),
        isSimpleOtp: false,
      })

      setOtp(Array(OTP_LENGTH).fill(""))
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      showErrorToast(message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1)

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Auto-focus next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      const char = pastedData[i]
      if (char !== undefined) {
        newOtp[i] = char
      }
    }

    setOtp(newOtp)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus()
    }
  }

  return (
    <AuthSplitLayout>
      <ScrollView
        contentContainerStyle={{
          maxWidth: 420,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xxxl,
        }}
      >
        <View style={{ marginBottom: spacing.xxxxl }}>
          <Text
            style={{
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.semibold,
              color: Colors.text,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Verify your email
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.neutral100,
              textAlign: "center",
            }}
          >
            An OTP sent to your registered email.
          </Text>
        </View>

        <View style={{ gap: spacing.xxxl }}>
          <Text
            style={{
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              color: Colors.text,
            }}
          >
            Enter OTP here
          </Text>

          {/* OTP Input Boxes */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              justifyContent: "center",
            }}
          >
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                disabled={loading}
                style={{
                  width: 72,
                  height: 56,
                  border: `1px solid ${showError ? Colors.error : Colors.border}`,
                  borderRadius: radius.md,
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.semibold,
                  textAlign: "center",
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  outline: "none",
                  fontFamily: "inherit",
                }}
                placeholder={focusedIndex === index ? "" : "-"}
              />
            ))}
          </View>

          {showError ? (
            <Text
              style={{
                fontSize: fontSizes.xs,
                color: Colors.error,
              }}
            >
              Enter the {OTP_LENGTH}-digit code sent to your number
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.sm,
                color: Colors.textSecondary,
              }}
            >
              Didn't receive OTP?{" "}
            </Text>
            <button
              type="button"
              onClick={resendTimer === 0 ? handleResendOTP : undefined}
              disabled={resendTimer > 0 || loading}
              style={{
                border: "none",
                backgroundColor: "transparent",
                padding: 0,
                margin: 0,
                cursor: resendTimer === 0 && !loading ? "pointer" : "not-allowed",
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.semibold,
                color: Colors.neutral100,
                opacity: resendTimer === 0 && !loading ? 1 : 0.5,
                fontFamily: "inherit",
              }}
            >
              {resendTimer > 0 ? `Re-Send (${resendTimer}s)` : "Re-Send"}
            </button>
          </View>

          <View style={{ marginTop: spacing.xxxl }}>
            <Button
              title="Continue"
              loadingTitle="Verifying..."
              onPress={handleVerifyOTP}
              loading={loading}
              disabled={isSubmitDisabled}
            />
          </View>
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}
